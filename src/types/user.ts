export interface User {
    id: String
    password: String
    isVerified: Boolean
    otp: String
    otpExpires: Date
    verificationToken: String
    resetToken: String
    resetTokenExpiry: Date
    profile: Profile
    createdAt: Date
    updatedAt: Date
}

export interface Profile {
    id: String
    userId: String
    username: String
    displayName: String
    avatarUrl: String
    bio: String
    role: UserRole
    coins: Number
    createdAt: Date
    updatedAt: Date
    user: User
}


interface UserRole {
    admin: String
    creator: String
    user: String
}