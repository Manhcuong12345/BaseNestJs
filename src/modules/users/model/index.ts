import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import { IFUser } from '../interface';

export const UserSchema = new Schema<IFUser>({
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    phone_number: {
        type: String
    },
    gender: {
        type: String
    },
    birthdate: {
        type: Number
    },
    admin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
    },
    fcm_token: [
        {
            type: String
        }
    ],
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    authGoogleId: {
        type: String,
        default: null
    },
    authFacebookId: {
        type: String,
        default: null
    },
    created_time: {
        type: Number,
        default: Date.now(),
        immutable: true
    }
});

UserSchema.methods.generateToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            type: 'User'
        },
        '123456'
    );
};

UserSchema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IFUser>('User', UserSchema);
