import { celebrate, Segments, Joi } from 'celebrate';

export const validateSignUp = celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().alphanum().min(3).max(39),
    lastName: Joi.string().alphanum().min(3).max(39),
    email: Joi.string().required(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().required(),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});
