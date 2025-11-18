import toast from 'react-hot-toast';
import { authenticate } from './helper';

/** Validate username */
export async function usernameValidate(values) {
    const errors = usernameVerify(values);

    if (values.username) {
        try {
            const { status } = await authenticate(values.username);
            if (status !== 200) {
                errors.exist = toast.error("User doesn't exist");
            }
        } catch (err) {
            errors.exist = toast.error("Server error while checking username");
        }
    }

    // Show toast for each error
    if (errors.username) toast.error(errors.username);

    return errors;
}

/** Validate password */
export function passwordValidate(values) {
    const errors = passwordVerify(values);
    if (errors.password) toast.error(errors.password);
    return errors;
}

/** Validate reset password */
export function resetPasswordValidation(values) {
    const errors = passwordVerify(values);

    // Confirm password checks
    if (!values.confirm_pwd) {
        errors.confirm_pwd = "Confirm Password is required!";
        toast.error(errors.confirm_pwd);
    } else if (values.password !== values.confirm_pwd) {
        errors.confirm_pwd = "Passwords do not match!";
        toast.error(errors.confirm_pwd);
    }

    if (errors.password) toast.error(errors.password);
    return errors;
}

/** Validate register form */
export async function registerValidation(values) {
    const errors = {};

    usernameVerify(values, errors);
    passwordVerify(values, errors);
    emailVerify(values, errors);

    if (errors.username) toast.error(errors.username);
    if (errors.password) toast.error(errors.password);
    if (errors.email) toast.error(errors.email);

    return errors;
}

/** Validate profile page (only email check) */
export async function profileValidation(values) {
    const errors = {};
    emailVerify(values, errors);
    if (errors.email) toast.error(errors.email);
    return errors;
}

/** Password verification logic */
function passwordVerify(values, errors = {}) {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

    if (!values.password) {
        errors.password = "Password required!";
    } else if (values.password.includes(" ")) {
        errors.password = "Password cannot contain spaces!";
    } else if (values.password.length < 4) {
        errors.password = "Password must be more than 4 characters!";
    } else if (!specialChars.test(values.password)) {
        errors.password = "Password must include at least one special character!";
    }

    return errors;
}

/** Username verification logic */
function usernameVerify(values, errors = {}) {
    if (!values.username) {
        errors.username = "Username required!";
    } else if (values.username.includes(" ")) {
        errors.username = "Username cannot contain spaces!";
    }
    return errors;
}

/** Email verification logic */
function emailVerify(values, errors = {}) {
    if (!values.email) {
        errors.email = "Email required!";
    } else if (values.email.includes(" ")) {
        errors.email = "Invalid email format!";
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email)) {
            errors.email = "Invalid email address!";
        }
    }
    return errors;
}
