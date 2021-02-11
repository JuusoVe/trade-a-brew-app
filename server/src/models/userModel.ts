import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../types/interfaces';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { JWT_SECRET } from "../utils/secrets";
import mongooseUniqueValidator = require("mongoose-unique-validator");

// Type '(string | RegExp)[]' is not assignable to type 
// '{ (regexp: string | RegExp): RegExpMatchArray; (matcher: { [Symbol.match](string: string): RegExpMatchArray; }): RegExpMatchArray; }'.
//   Type '(string | RegExp)[]' provides no match for the signature '(regexp: string | RegExp): RegExpMatchArray'.ts(2322)

const UserSchema = new Schema<IUserDocument, IUserModel>({
  username : {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, "can't be blank"],
    match    : /^[a-zA-Z0-9]+$/,
    index    : true
  },
  email    : {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    required : [true, "can't be blank"],
    match    : /\S+@\S+\.\S+/,
    index    : true
  },
  offers: [     
    {
      type: Schema.Types.ObjectId,
      ref : 'Offer'
    }
  ],
  hash: {
    type: Schema.Types.String
  },
  salt: {
    type: Schema.Types.String
  },
}, {timestamps: true});


export interface IUserDocument extends IUser, Document {
  hash: string;
  salt: string;
  generateJWT(): string;
  toAuthJSON(): any;
  setPassword(password: string): void;
}

export interface IUserModel extends Model<IUserDocument> {
  token?: string;
  offers: [Schema.Types.ObjectId];
}

UserSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password: string): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const exp   = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id      : this._id,
    username: this.username,
    exp     : exp.getTime() / 1000,
  }, JWT_SECRET);
};


UserSchema.methods.toAuthJSON = function (): any {
  return {
    displayName: this.username,
    token: this.generateJWT(),
    id: this.id    
  };
};


export default model<IUserDocument, IUserModel>("User", UserSchema)