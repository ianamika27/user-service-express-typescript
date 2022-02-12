import * as jwt from 'jsonwebtoken';

import User from '../models/User';
import Locals from '../providers/Locals';

class Signin {
    public static perform (req, res): any {
        //console.log(req.body)
        // req.checkBody('email', 'E-mail cannot be blank').notEmpty();
        // req.checkBody('email', 'E-mail is not valid').isEmail();
        // req.checkBody('password', 'Password cannot be blank').notEmpty();
        // req.checkBody('password', 'Password length must be atleast 8 characters').isLength({ min: 8 });
        // req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

        // const errors = req.validationErrors();
        // if (errors) {
        //     return res.json({
        //         errors
        //     });
        // }

        const _email = req.body.email.toLowerCase();
        const _password = req.body.password;

        User.findOne({email: _email}, (err, user) => {
            if (err) {
                return res.json({
                    error: err
                });
            }

            if (! user) {
                return res.json({
                    error: ['User not found!']
                });
            }

            if (! user.password) {
                return res.json({
                    error: ['Please login using your valid credentials']
                });
            }

            user.comparePassword(_password, (err, isMatch) => {
                if (err) {
                    return res.json({
                        error: err
                    });
                }

                if (! isMatch) {
                    return res.json({
                        error: ['Password does not match!']
                    });
                }
                
                const token = jwt.sign({ id: user.id },Locals.config().appSecret,{ expiresIn: Locals.config().jwtExpiresIn });

                const cookieOptions = {
                    expires:new Date(Date.now()+parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000),
                    httpOnly:true,
                    secure:true
                }
                if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
                res.cookie('jwt',token,cookieOptions);

                // Hide protected columns
                
                user.password = undefined;

                return res.status(200).json({
                    status:true,
                    user,
                    token,
                    token_expires_in: Locals.config().jwtExpiresIn
                });
            });
        });
    }
}

export default Signin;
