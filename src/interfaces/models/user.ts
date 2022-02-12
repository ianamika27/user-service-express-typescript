export interface Tokens {
	kind: string;
	accessToken: string;
	tokenSecret?: string;
}
export interface IUser {
	
	email: string;
    username: string;
	password: string;
    passwordChangedAt: Date;
	passwordResetToken: string;
	passwordResetExpires: Date;
    active:{
        kind:Boolean,
        default:true,
        select:false
    }

	facebook: string;
	twitter: string;
	google: string;
	github: string;
	instagram: string;
	linkedin: string;
	tokens: Tokens[];
	steam: string;

	fullname:string
	gender: string;
	geolocation: string;
	website: string;
	picture: string;
}

export default IUser;