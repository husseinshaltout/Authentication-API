import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import config from '@config';

interface UserAttributes {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  creationDate: Date;
}

interface UserDocument extends UserAttributes, Document {
  _id: string;
  isCorrectPassword: (
    inputPassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

// Validator Function
function confirmPassword(
  this: UserDocument,
  password: UserAttributes['password']
) {
  if (!this.isModified('password')) return true;
  return password === this.passwordConfirm;
}

const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    minlength: [2, 'Name Too Short'],
    maxlength: [40, 'Name Too Long'],
    required: [true, 'Please Enter First Name'],
  },
  lastName: {
    type: String,
    minlength: [2, 'Name Too Short'],
    maxlength: [40, 'Name Too Long'],
    required: [true, 'Please Enter Last Name'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please Enter Email'],
    validate: [validator.isEmail, 'Please Enter a Valid Email'],
  },
  password: {
    type: String,
    minlength: [8, 'Password Too Short'],
    maxlength: [64, 'Password Too Long'],
    select: false,
    required: [true, 'Please Enter a Password'],
    validate: [confirmPassword, 'Cannot Confirm password'],
  },
  passwordConfirm: String,
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', hashPassword);

// Password Hashing and Updating
async function hashPassword(this: UserDocument, next: any) {
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(
    this.password + config.AUTH.PEPPER,
    parseInt(config.AUTH.SALT_ROUNDS)
  );
  this.passwordConfirm = undefined;
}

// Utility Password Checker
userSchema.methods.isCorrectPassword = async function (
  inputPassword: string,
  userPassword: string
) {
  return bcrypt.compareSync(inputPassword + config.AUTH.PEPPER, userPassword);
};

userSchema.statics.isEmailExists = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = model<UserDocument>('User', userSchema);

export { User, UserDocument, UserAttributes };
