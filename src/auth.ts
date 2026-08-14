import { supabase } from "./supabase.js";

// --------------------------------------------------
// SIGN UP
// --------------------------------------------------

export async function signUp(
    email: string,
    password: string,
    onlineId: string
) {
    const cleanEmail = email.trim();
    const cleanOnlineId = onlineId.trim();

    const { data, error } =
        await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
                data: {
                    online_id: cleanOnlineId,
                },
            },
        });

    if (error) {
        throw error;
    }

    return data;
}

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

export async function login(
    email: string,
    password: string
) {
    const cleanEmail = email.trim();

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        });

    if (error) {
        throw error;
    }

    return data;
}

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

export async function logout(): Promise<void> {
    const { error } =
        await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

// --------------------------------------------------
// CURRENT USER
// --------------------------------------------------

export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return user;
}

// --------------------------------------------------
// MY PROFILE
// --------------------------------------------------

export async function getMyProfile() {

    const user =
        await getCurrentUser();

    if (!user) {
        return null;
    }

    const { data, error } =
        await supabase
            .from("profiles")
            .select(
                "online_id, coins, total_pipes, best_score"
            )
            .eq("id", user.id)
            .single();

    if (error) {
        throw error;
    }

    return data;
}