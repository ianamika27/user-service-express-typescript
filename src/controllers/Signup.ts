import User from '../models/User';

class Signup{
    public static perform (req,res): any{

        const _email = req.body.email;
		const _password = req.body.password;

		const user = new User({
			email: _email,
			password: _password
		});

        User.findOne({ email: _email }, (err, existingUser) => {
			if (err) {
				return res.json({
					error: err
				});
			}

			if (existingUser) {
				return res.json({
					error: ['Account with the e-mail address already exists.']
				});
			}

			user.save((err) => {
				if (err) {
					return res.json({
						error: err
					});
				}

				return res.json({
					message: ['You have been successfully registered with us!']
				});
			});
		});
    }
}

export default Signup;
