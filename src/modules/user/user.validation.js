import Joi from 'joi';

export const shareProfileSchema = Joi.object({
  params: Joi.object({
    shareProfileName: Joi.string()
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .trim()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      })
  })
});