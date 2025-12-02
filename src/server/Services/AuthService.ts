import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthRepository } from "../Repositories/AuthRepository.js";

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = "7d";

  constructor(private readonly authRepo: AuthRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET || "something-went-wrong";

    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET not set in environment variables!");
    }
  }

  public generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  public verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  public async login(email: string, password: string) {
    const user = await this.authRepo.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  public async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "student" | "tutor";
    meetingPreference: "in_person" | "zoom" | "either";
  }) {
    const existingUser = await this.authRepo.findUserByEmail(userData.email);

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.authRepo.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    };
  }

  public async getUserById(userId: number) {
    return await this.authRepo.findUserById(userId);
  }
}
