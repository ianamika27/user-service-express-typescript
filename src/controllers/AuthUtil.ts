import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import User from '../models/User';
import EmailService from '../services/EmailService'

class AuthUtil {
	
	public static signToken = id =>{
		return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
	}

	public static createSendToken = (user,statusCode,res) =>{
		const token = AuthUtil.signToken(user._id)

		const cookieOptions = {
			expires:new Date(Date.now()+parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000),
			httpOnly:true,
			secure:true
		}
		if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
		res.cookie('jwt',token,cookieOptions);

		//remove the password from output
		user.password=undefined;

		res.status(statusCode).json({
			status:true,
			token,
			user
		});
	}

	public static validatePassword(req, res, next): void {
		try{
			let password = req.body.password;
			if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)){
				return res.status(400).json({
					status:false,
					msg:"Password must be atleast 8 characters and must contain one uppercase and one lowercasse."
				})
			}
			next();
	
		}catch(err){
			return res.status(500).json({
				status:false,
				msg:err.message
			})
		}
	}

	public static async forgetPassword(req, res, next): Promise<string> {
		if(req.body.email){
			try{
				const _email = req.body.email.toLowerCase();
				const user = await User.findOne({email:_email});
				user.fullname='Anamika'
				if(!user){
					return res.status(404).json({
						status:false,
						msg:'User does not exits with this email. Try with registered email'
					})
				}
				const resetToken = user.createPasswordResetToken()
				try{
					await user.save({validateBeforeSave:false});

				}
				catch(error){
					return res.status(500).json({
						status:false,
						message:`Error in user save ${error}`
					});
				}
	
				try{
					const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
					try{
						await new EmailService(user,resetUrl).sendPasswordReset();
						res.status(200).json({
							status:true,
							message:`Reset token sent to email: ${req.body.email}`
						});
					}
					catch(error){
						return res.status(500).json({
							status:false,
							message:`Error in Email Send ${error}`
						});
					}
				}catch(err){
					user.passwordResetToken=undefined;
					user.passwordResetExpires=undefined;
					await user.save({validateBeforeSave:false});
					
					return res.status(500).json({
						status:false,
						msg:err.message,
						custom:'There was an error sending the email. Try again later!'
					})
				}
			}
			catch(err){
				return res.status(500).json({
					status:false,
					msg:`Erroe ${err}`
				})
			}
		}
		else{
			return res.status(500).json({
				status:false,
				message:'email is required'
			})
		}
	}
	
	public static async resetPassword (req, res, next): Promise<string> {
		try{

			// 1) Get user based on the token
			const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	
			const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
			if(!user){
				return res.status(400).json({
					status:false,
					msg:'UsToken is invalid or has expired'
				})
			}
	
			// 2) if token has not expired, and there is user, set the new password
			user.password = req.body.password;
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save();
	
			// 3) Update ChangedPasswordAt property for user
			// 4) Log the user in, Send JWT
			AuthUtil.createSendToken(user,200,res);
	
		}catch(err){
			return res.status(500).json({
				status:false,
				msg:err.message
			})
	
		}
	}

	public static async updatePassword (req, res, next): Promise<String> {
		try{
			//console.log(req.body.user)
			// 1) Get user from collection
			const user = await User.findById(req.body.id).select('+password');
			// 2) check if posted current password is correct
			// if(!(await User.correctPassword(req.body.passwordCurrent,user.password))){
			// 	return res.status(401).json({
			// 		status:false,
			// 		msg:"Your current password is wrong"
			// 	})
			// }
	
			// 3) if so, update password
			user.password = req.body.password;
			await user.save();
	
			// 4) Login user,send JWT
			this.createSendToken(user,200,res);
	
		}catch(err){
			return res.status(500).json({
				status:false,
				msg:err.message
			})
		}
	}
}

export default AuthUtil;
