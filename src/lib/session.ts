import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    throw new Error("CRITICAL: SESSION_SECRET is not defined in environment variables. JWT signing will fail.");
}
const key = new TextEncoder().encode(secretKey);


const SESSION_COOKIE_NAME_CLIENT = "client_session";
const SESSION_COOKIE_NAME_ADMIN = "admin_session";

export type SessionPayload = {
    userId: string;
    role: Role;
    email: string;
    name?: string | null;
};

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

export async function createSession(payload: SessionPayload) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt(payload);
    const cookieName = payload.role === "ADMIN" ? SESSION_COOKIE_NAME_ADMIN : SESSION_COOKIE_NAME_CLIENT;

    const cookieStore = await cookies();
    cookieStore.set(cookieName, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession(expectedRole?: Role) {
    const cookieStore = await cookies();
    let sessionValue;

    if (expectedRole === "ADMIN") {
        sessionValue = cookieStore.get(SESSION_COOKIE_NAME_ADMIN)?.value;
    } else if (expectedRole === "USER") {
        sessionValue = cookieStore.get(SESSION_COOKIE_NAME_CLIENT)?.value;
    } else {
        // Fallback for generic calls
        sessionValue = cookieStore.get(SESSION_COOKIE_NAME_CLIENT)?.value || cookieStore.get(SESSION_COOKIE_NAME_ADMIN)?.value;
    }

    if (!sessionValue) return null;
    return await decrypt(sessionValue);
}

export async function updateSession(role: Role) {
    const cookieName = role === "ADMIN" ? SESSION_COOKIE_NAME_ADMIN : SESSION_COOKIE_NAME_CLIENT;
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName)?.value;
    if (!session) return;

    const parsed = await decrypt(session);
    if (!parsed) return;

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    cookieStore.set(cookieName, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession(role: Role) {
    const cookieName = role === "ADMIN" ? SESSION_COOKIE_NAME_ADMIN : SESSION_COOKIE_NAME_CLIENT;
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
}
