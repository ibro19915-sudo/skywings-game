import { ctx, canvas } from "./game.js";
import { GS } from "./gameState.js";
import {
    login,
    signUp,
    getCurrentUser,
    getMyProfile,
} from "./auth.js";
import { Button } from "./button.js";

// ==================================================
// CARET / PASSWORD STATE
// ==================================================

let caretVisible = true;
let caretTimer = 0;

let passwordVisible = false;

// ==================================================
// ONLINE ID RULES
// ==================================================

const ONLINE_ID_MIN_LENGTH = 3;
const ONLINE_ID_MAX_LENGTH = 16;

function isValidOnlineId(
    onlineId: string
): boolean {

    if (
        onlineId.length <
        ONLINE_ID_MIN_LENGTH
    ) {
        return false;
    }

    if (
        onlineId.length >
        ONLINE_ID_MAX_LENGTH
    ) {
        return false;
    }

    return /^[A-Za-z0-9_]+$/.test(
        onlineId
    );
}

// ==================================================
// BUTTONS
// ==================================================

export const loginActionButton = new Button(
    canvas.width / 2 - 160,
    350,
    320,
    60,
    "LOGIN",
    "🔑"
);

export const signupButton = new Button(
    canvas.width / 2 - 160,
    425,
    320,
    60,
    "SIGN UP",
    "👤"
);

export const loginBackButton = new Button(
    canvas.width / 2 - 160,
    500,
    320,
    60,
    "BACK",
    "↩"
);

// ==================================================
// INPUT SETTINGS
// ==================================================

const inputWidth = 400;
const inputHeight = 52;

function inputX(): number {
    return (
        canvas.width / 2 -
        inputWidth / 2
    );
}

// Screenshot-style positions
const emailY = 145;
const passwordY = 235;
const onlineIdY = 325;

// ==================================================
// OPEN LOGIN SCREEN
// ==================================================

export function openLoginScreen(): void {

    GS.showLoginScreen = true;

    GS.loginEmail = "";
    GS.loginPassword = "";
    GS.loginOnlineId = "";

    GS.loginMode = "login";

    GS.loginMessage = "";
    GS.loginLoading = false;

    GS.loginField = "email";

    passwordVisible = false;

    caretVisible = true;
    caretTimer = 0;
}

// ==================================================
// CLOSE LOGIN SCREEN
// ==================================================

export function closeLoginScreen(): void {

    GS.showLoginScreen = false;

    passwordVisible = false;

    caretVisible = true;
    caretTimer = 0;
}

// ==================================================
// INPUT BOX
// ==================================================

function drawInputBox(
    x: number,
    y: number,
    label: string,
    value: string,
    placeholder: string,
    active: boolean,
    password: boolean = false
): void {

    // --------------------------------------------------
    // LABEL
    // --------------------------------------------------

    ctx.textAlign = "left";

    ctx.font = "18px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(
        label,
        x,
        y - 8
    );

    // --------------------------------------------------
    // BOX
    // --------------------------------------------------

    ctx.fillStyle = active
        ? "#103F5C"
        : "#0D344C";

    ctx.strokeStyle = active
        ? "#4DB8FF"
        : "#28627F";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        inputWidth,
        inputHeight,
        10
    );

    ctx.fill();
    ctx.stroke();

    // --------------------------------------------------
    // DISPLAY VALUE
    // --------------------------------------------------

    let displayValue = value;

    if (
        password &&
        !passwordVisible
    ) {

        displayValue =
            "*".repeat(
                value.length
            );
    }

    const shownText =
        displayValue.length > 0
            ? displayValue
            : placeholder;

    ctx.font = "20px Arial";

    ctx.textAlign = "left";

    ctx.fillStyle =
        displayValue.length > 0
            ? "white"
            : "#9BB2BF";

    ctx.fillText(
        shownText,
        x + 18,
        y + 33
    );

    // --------------------------------------------------
    // PASSWORD SHOW / HIDE
    // --------------------------------------------------

    if (password) {

        const eyeX =
            x +
            inputWidth -
            38;

        const eyeY =
            y +
            inputHeight / 2;

        ctx.fillStyle =
            "#174D69";

        ctx.beginPath();

        ctx.roundRect(
            eyeX - 22,
            eyeY - 18,
            44,
            36,
            8
        );

        ctx.fill();

        ctx.font = "13px Arial";

        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.fillText(
            passwordVisible
                ? "HIDE"
                : "SHOW",
            eyeX,
            eyeY + 5
        );
    }

    // --------------------------------------------------
    // CARET
    // --------------------------------------------------

    if (
        active &&
        caretVisible
    ) {

        ctx.fillStyle = "white";

        ctx.font = "20px Arial";

        ctx.textAlign = "left";

        const textBeforeCaret =
            value.length > 0
                ? (
                    password &&
                    !passwordVisible
                        ? "*".repeat(
                            value.length
                        )
                        : value
                )
                : "";

        let caretX: number;

        if (
            value.length === 0
        ) {

            caretX =
                x + 14;

        } else {

            caretX =
                x +
                18 +
                ctx.measureText(
                    textBeforeCaret
                ).width +
                2;
        }

        const maxCaretX =
            password
                ? x + inputWidth - 60
                : x + inputWidth - 18;

        ctx.fillRect(
            Math.min(
                caretX,
                maxCaretX
            ),
            y + 12,
            2,
            28
        );
    }
}

// ==================================================
// LOGIN SCREEN
// ==================================================

export function drawLoginScreen(): void {

    // ==================================================
    // BACKGROUND
    // ==================================================

    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ==================================================
    // PANEL
    // ==================================================

    const isSignup =
        GS.loginMode === "signup";

    const panelWidth = 500;

    /*
     * Login:
     *   560px
     *
     * Signup:
     *   720px
     *
     * The signup panel is taller so the BACK button
     * is completely visible instead of being clipped.
     */

    const panelHeight =
    isSignup
        ? canvas.height - 40
        : 560;

    const panelX =
        canvas.width / 2 -
        panelWidth / 2;

    const panelY = 20;

    // --------------------------------------------------
    // PANEL BACKGROUND
    // --------------------------------------------------

    ctx.fillStyle = "#68B9D8";

    ctx.strokeStyle = "#111111";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.roundRect(
        panelX,
        panelY,
        panelWidth,
        panelHeight,
        4
    );

    ctx.fill();

    // --------------------------------------------------
    // LEFT / RIGHT BORDERS
    // --------------------------------------------------

    ctx.beginPath();

    ctx.moveTo(
        panelX,
        panelY + 4
    );

    ctx.lineTo(
        panelX,
        panelY +
        panelHeight -
        4
    );

    ctx.moveTo(
        panelX + panelWidth,
        panelY + 4
    );

    ctx.lineTo(
        panelX + panelWidth,
        panelY +
        panelHeight -
        4
    );

    ctx.stroke();

    // ==================================================
    // TITLE
    // ==================================================

    ctx.textAlign = "center";

    ctx.fillStyle = "white";

    ctx.font = "42px Arial";

    ctx.fillText(
        isSignup
            ? "CREATE ACCOUNT"
            : "SIGN IN",
        canvas.width / 2,
        75
    );

    // ==================================================
    // SUBTITLE
    // ==================================================

    ctx.font = "18px Arial";

    ctx.fillStyle = "#FFF200";

    ctx.fillText(
        "ONLINE ACCOUNT",
        canvas.width / 2,
        105
    );

    // ==================================================
    // CARET TIMER
    // ==================================================

    caretTimer++;

    if (
        caretTimer >= 30
    ) {

        caretVisible =
            !caretVisible;

        caretTimer = 0;
    }

    // ==================================================
    // INPUTS
    // ==================================================

    const x = inputX();

    // --------------------------------------------------
    // EMAIL
    // --------------------------------------------------

    drawInputBox(
        x,
        emailY,
        "Email",
        GS.loginEmail,
        "Enter your email",
        GS.loginField === "email"
    );

    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    drawInputBox(
        x,
        passwordY,
        "Password",
        GS.loginPassword,
        "Enter your password",
        GS.loginField === "password",
        true
    );

    // ==================================================
    // ONLINE ID
    // ==================================================

    if (isSignup) {

        drawInputBox(
            x,
            onlineIdY,
            "Online ID",
            GS.loginOnlineId,
            "Choose your Online ID",
            GS.loginField === "onlineId"
        );

        // --------------------------------------------------
        // ONLINE ID RULES TEXT
        // --------------------------------------------------

        ctx.textAlign = "center";

        ctx.font = "14px Arial";

        ctx.fillStyle = "#D9F4FF";

        ctx.fillText(
            "3–16 characters: letters, numbers and _",
            canvas.width / 2,
            onlineIdY + 78
        );
    }

    // ==================================================
    // STATUS MESSAGE
    // ==================================================

    if (
        GS.loginMessage
    ) {

        ctx.textAlign = "center";

        ctx.font = "16px Arial";

        /*
         * Email confirmation message gets a little
         * more room on signup.
         */

        if (
            isSignup &&
            GS.loginMessage.length > 35
        ) {

            ctx.fillStyle =
                "#FFF200";

            // First line
            const words =
                GS.loginMessage.split(" ");

            let line1 = "";
            let line2 = "";

            for (
                const word of words
            ) {

                if (
                    (
                        line1 +
                        " " +
                        word
                    ).length < 42
                ) {

                    line1 +=
                        (
                            line1
                                ? " "
                                : ""
                        ) +
                        word;

                } else {

                    line2 +=
                        (
                            line2
                                ? " "
                                : ""
                        ) +
                        word;
                }
            }

            ctx.fillText(
                line1,
                canvas.width / 2,
                445
            );

            if (line2) {

                ctx.fillText(
                    line2,
                    canvas.width / 2,
                    468
                );
            }

        } else {

            ctx.fillStyle =
                "#FFD700";

            ctx.fillText(
                GS.loginMessage,
                canvas.width / 2,
                isSignup
                    ? 455
                    : 300
            );
        }
    }

    // ==================================================
    // BUTTON TEXT
    // ==================================================

    loginActionButton.text =
        isSignup
            ? "CREATE ACCOUNT"
            : "LOGIN";

    signupButton.text =
        isSignup
            ? "BACK TO LOGIN"
            : "SIGN UP";

    loginBackButton.text =
        "BACK";

    // ==================================================
    // BUTTON X POSITIONS
    // ==================================================

    loginActionButton.x =
        canvas.width / 2 -
        loginActionButton.width / 2;

    signupButton.x =
        canvas.width / 2 -
        signupButton.width / 2;

    loginBackButton.x =
        canvas.width / 2 -
        loginBackButton.width / 2;

    // ==================================================
// BUTTON Y POSITIONS
// ==================================================

if (!isSignup) {

    loginActionButton.y = 325;

    signupButton.y = 400;

    loginBackButton.y = 475;

} else {

    // Keep all three buttons inside the visible panel.
    const buttonHeight = 60;
    const buttonGap = 15;

    const bottomMargin = 20;

    const backY =
        panelY +
        panelHeight -
        bottomMargin -
        buttonHeight;

    const signupY =
        backY -
        buttonGap -
        buttonHeight;

    const createY =
        signupY -
        buttonGap -
        buttonHeight;

    loginActionButton.y = createY;

    signupButton.y = signupY;

    loginBackButton.y = backY;
}

    // ==================================================
    // DRAW BUTTONS
    // ==================================================

    loginActionButton.draw(ctx);

    signupButton.draw(ctx);

    loginBackButton.draw(ctx);
}

// ==================================================
// FIELD CLICK HANDLING
// ==================================================

export function handleLoginFieldClick(
    mouseX: number,
    mouseY: number
): boolean {

    const x = inputX();

    // ==================================================
    // EMAIL
    // ==================================================

    if (
        mouseX >= x &&
        mouseX <= x + inputWidth &&
        mouseY >= emailY &&
        mouseY <=
            emailY + inputHeight
    ) {

        GS.loginField =
            "email";

        caretVisible = true;
        caretTimer = 0;

        return true;
    }

    // ==================================================
    // PASSWORD
    // ==================================================

    if (
        mouseX >= x &&
        mouseX <= x + inputWidth &&
        mouseY >= passwordY &&
        mouseY <=
            passwordY + inputHeight
    ) {

        const eyeX =
            x +
            inputWidth -
            38;

        const eyeY =
            passwordY +
            inputHeight / 2;

        const eyeLeft =
            eyeX - 22;

        const eyeRight =
            eyeX + 22;

        const eyeTop =
            eyeY - 18;

        const eyeBottom =
            eyeY + 18;

        // --------------------------------------------------
        // SHOW / HIDE BUTTON
        // --------------------------------------------------

        if (
            mouseX >= eyeLeft &&
            mouseX <= eyeRight &&
            mouseY >= eyeTop &&
            mouseY <= eyeBottom
        ) {

            passwordVisible =
                !passwordVisible;

            GS.loginField =
                "password";

            caretVisible = true;
            caretTimer = 0;

            return true;
        }

        GS.loginField =
            "password";

        caretVisible = true;
        caretTimer = 0;

        return true;
    }

    // ==================================================
    // ONLINE ID
    // ==================================================

    if (
        GS.loginMode === "signup" &&
        mouseX >= x &&
        mouseX <=
            x + inputWidth &&
        mouseY >= onlineIdY &&
        mouseY <=
            onlineIdY + inputHeight
    ) {

        GS.loginField =
            "onlineId";

        caretVisible = true;
        caretTimer = 0;

        return true;
    }

    return false;
}

// ==================================================
// KEYBOARD INPUT
// ==================================================

export function handleLoginKey(
    key: string
): void {

    if (
        !GS.showLoginScreen
    ) {
        return;
    }

    // ==================================================
    // ESCAPE
    // ==================================================

    if (
        key === "Escape"
    ) {

        closeLoginScreen();

        return;
    }

    // ==================================================
    // TAB
    // ==================================================

    if (
        key === "Tab"
    ) {

        if (
            GS.loginMode === "login"
        ) {

            GS.loginField =
                GS.loginField === "email"
                    ? "password"
                    : "email";

        } else {

            if (
                GS.loginField === "email"
            ) {

                GS.loginField =
                    "password";

            } else if (
                GS.loginField === "password"
            ) {

                GS.loginField =
                    "onlineId";

            } else {

                GS.loginField =
                    "email";
            }
        }

        caretVisible = true;
        caretTimer = 0;

        return;
    }

    // ==================================================
    // BACKSPACE
    // ==================================================

    if (
        key === "Backspace"
    ) {

        if (
            GS.loginField === "email"
        ) {

            GS.loginEmail =
                GS.loginEmail.slice(
                    0,
                    -1
                );

        } else if (
            GS.loginField === "password"
        ) {

            GS.loginPassword =
                GS.loginPassword.slice(
                    0,
                    -1
                );

        } else if (
            GS.loginField === "onlineId"
        ) {

            GS.loginOnlineId =
                GS.loginOnlineId.slice(
                    0,
                    -1
                );
        }

        caretVisible = true;
        caretTimer = 0;

        return;
    }

    // ==================================================
    // ENTER
    // ==================================================

    if (
        key === "Enter"
    ) {

        void handleSubmit();

        return;
    }

    // ==================================================
    // SPACE
    // ==================================================

    if (
        key === " "
    ) {

        return;
    }

    // ==================================================
    // NORMAL CHARACTER
    // ==================================================

    if (
        key.length === 1
    ) {

        // --------------------------------------------------
        // EMAIL
        // --------------------------------------------------

        if (
            GS.loginField === "email"
        ) {

            GS.loginEmail += key;
        }

        // --------------------------------------------------
        // PASSWORD
        // --------------------------------------------------

        else if (
            GS.loginField === "password"
        ) {

            GS.loginPassword += key;
        }

        // --------------------------------------------------
        // ONLINE ID
        // --------------------------------------------------

        else if (
            GS.loginField === "onlineId"
        ) {

            /*
             * Online IDs only allow:
             *
             * A-Z
             * a-z
             * 0-9
             * _
             */

            if (
                /^[A-Za-z0-9_]$/.test(
                    key
                ) &&
                GS.loginOnlineId.length <
                    ONLINE_ID_MAX_LENGTH
            ) {

                GS.loginOnlineId += key;
            }
        }

        caretVisible = true;
        caretTimer = 0;
    }
}

// ==================================================
// SUBMIT
// ==================================================

async function handleSubmit(): Promise<void> {

    const isSignup =
        GS.loginMode === "signup";

    // ==================================================
    // LOGIN VALIDATION
    // ==================================================

    if (!isSignup) {

        if (
            !GS.loginEmail.trim() ||
            !GS.loginPassword
        ) {

            GS.loginMessage =
                "Enter email and password.";

            return;
        }
    }

    // ==================================================
    // SIGNUP VALIDATION
    // ==================================================

    else {

        if (
            !GS.loginEmail.trim() ||
            !GS.loginPassword ||
            !GS.loginOnlineId
        ) {

            GS.loginMessage =
                "Enter email, password and Online ID.";

            return;
        }

        // --------------------------------------------------
        // ONLINE ID LENGTH
        // --------------------------------------------------

        if (
            GS.loginOnlineId.length <
            ONLINE_ID_MIN_LENGTH
        ) {

            GS.loginMessage =
                "Online ID must be at least 3 characters.";

            return;
        }

        if (
            GS.loginOnlineId.length >
            ONLINE_ID_MAX_LENGTH
        ) {

            GS.loginMessage =
                "Online ID can be at most 16 characters.";

            return;
        }

        // --------------------------------------------------
        // ONLINE ID CHARACTERS
        // --------------------------------------------------

        if (
            !isValidOnlineId(
                GS.loginOnlineId
            )
        ) {

            GS.loginMessage =
                "Online ID can only use letters, numbers and _.";

            return;
        }
    }

    // ==================================================
    // LOADING
    // ==================================================

    GS.loginLoading = true;

    GS.loginMessage = "";

    try {

        // ==================================================
        // LOGIN
        // ==================================================

        if (!isSignup) {

            await login(
                GS.loginEmail.trim(),
                GS.loginPassword
            );

            const user =
                await getCurrentUser();

            if (!user) {

                throw new Error(
                    "Could not load your account."
                );
            }

            // --------------------------------------------------
            // STORE SUPABASE USER ID
            // --------------------------------------------------

            GS.onlineUserId =
                user.id;

            // --------------------------------------------------
            // LOAD PROFILE
            // --------------------------------------------------

            const profile =
                await getMyProfile();

            if (!profile) {

                throw new Error(
                    "Could not load your player profile."
                );
            }

            // --------------------------------------------------
            // STORE ONLINE ID
            // --------------------------------------------------

            GS.onlineId =
                profile.online_id;

            GS.loginOnlineId =
                profile.online_id;

            GS.loginMessage =
                `Welcome back, ${profile.online_id}!`;

            return;
        }

        // ==================================================
        // SIGN UP
        // ==================================================

        /*
         * IMPORTANT:
         *
         * Email confirmation is ON.
         *
         * Therefore we DO NOT try to getCurrentUser()
         * after signUp().
         *
         * Supabase normally returns:
         *
         * session = null
         *
         * until the player confirms their email.
         */

        await signUp(
            GS.loginEmail.trim(),
            GS.loginPassword,
            GS.loginOnlineId
        );

        // --------------------------------------------------
        // EMAIL CONFIRMATION REQUIRED
        // --------------------------------------------------

        GS.loginMessage =
            "Account created! Check your email to confirm your account.";

        /*
         * Return to the login screen after displaying
         * the confirmation message.
         *
         * We deliberately do NOT log the user in here.
         */

        GS.loginMode = "login";

        GS.loginEmail = "";

        GS.loginPassword = "";

        GS.loginOnlineId = "";

        GS.loginField = "email";

        passwordVisible = false;

        caretVisible = true;
        caretTimer = 0;

    } catch (error: any) {

        // ==================================================
        // SUPABASE ERRORS
        // ==================================================

        const message =
            error?.message ||
            "";

        // --------------------------------------------------
        // EMAIL ALREADY REGISTERED
        // --------------------------------------------------

        if (
            message
                .toLowerCase()
                .includes(
                    "already registered"
                )
        ) {

            GS.loginMessage =
                "This email is already registered.";

        }

        // --------------------------------------------------
        // EMAIL NOT CONFIRMED
        // --------------------------------------------------

        else if (
            message
                .toLowerCase()
                .includes(
                    "email not confirmed"
                )
        ) {

            GS.loginMessage =
                "Please confirm your email before logging in.";

        }

        // --------------------------------------------------
        // INVALID LOGIN
        // --------------------------------------------------

        else if (
            message
                .toLowerCase()
                .includes(
                    "invalid login credentials"
                )
        ) {

            GS.loginMessage =
                "Incorrect email or password.";

        }

        // --------------------------------------------------
        // GENERIC ERROR
        // --------------------------------------------------

        else {

            GS.loginMessage =
                message ||
                "Something went wrong.";
        }

    } finally {

        GS.loginLoading = false;
    }
}