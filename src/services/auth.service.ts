import bcrypt from "bcryptjs";
import User from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { Role } from "../enums/role.enum";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { verifyRefreshToken } from "../utils/jwt";

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role || Role.GUEST;
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole,
    active: true,
  });

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user.id,
    token: await bcrypt.hash(refreshToken, 10),
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({
    userId: user.id,
    token: await bcrypt.hash(refreshToken, 10),
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== "object" || !("id" in decoded)) {
      throw new AuthenticationError("Invalid refresh token");
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const storedToken = await RefreshToken.findOne({
      where: { userId: user.id },
    });
    if (!storedToken) {
      throw new AuthenticationError("Refresh token not found");
    }

    const isValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isValid) {
      throw new AuthenticationError("Invalid refresh token");
    }

    if (new Date() > storedToken.expiresAt) {
      throw new AuthenticationError("Refresh token has expired");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AuthenticationError("Token refresh failed");
  }
};

export const logoutUser = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  await RefreshToken.destroy({ where: { userId } });
  return { message: "User logged out successfully" };
};
