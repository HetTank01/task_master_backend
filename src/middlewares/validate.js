import Joi from "joi";

export const validateBoard = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .required()
            .messages({
                "string.min": "Title must be at least 3 characters long.",
                "string.max": "Title must not exceed 50 characters.",
                "string.pattern.base": "Title must contain only letters, numbers, and spaces.",
                "any.required": "Title is required."
            }),

        UserMasterId: Joi.number()
            .required()
            .messages({ "any.required": "UserMasterId is required." })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};


export const validateList = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .required()
            .messages({
                "string.min": "Title must be at least 3 characters long.",
                "string.max": "Title must not exceed 50 characters.",
                "string.pattern.base": "Title must contain only letters, numbers, and spaces.",
                "any.required": "Title is required."
            }),

        BoardMasterId: Joi.number()
            .required()
            .messages({ "any.required": "BoardMasterId is required." })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};

export const validateCard = (req, res, next) => {
    const isUpdating = req.method === "PATCH";

    const schema = Joi.object({
        title: isUpdating
            ? Joi.string().max(50).optional()  // Title is optional when updating
            : Joi.string().max(50).required().messages({
                "string.max": "Title must not exceed 50 characters.",
            }),

        description: Joi.string().allow(null, ''),

        ListMasterId: Joi.number()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};

export const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.min": "Username must be at least 3 characters long.",
                "string.max": "Username must not exceed 50 characters.",
                "any.required": "Username is required."
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Invalid email format.",
                "any.required": "Email is required."
            }),

        password: Joi.string()
            .min(6)
            .max(50)
            .required()
            .messages({
                "string.min": "Password must be at least 6 characters long.",
                "string.max": "Password must not exceed 50 characters.",
                "any.required": "Password is required."
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};

export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Invalid email format.",
                "any.required": "Email is required."
            }),

        password: Joi.string()
            .min(6)
            .max(50)
            .required()
            .messages({
                "string.min": "Password must be at least 6 characters long.",
                "string.max": "Password must not exceed 50 characters.",
                "any.required": "Password is required."
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    next();
};
