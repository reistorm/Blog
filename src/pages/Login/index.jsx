import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

import styles from "./Login.module.scss";

export const Login = () => {
  // авторизован ли пользователь
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'test@test.ru',
      password: '12345'
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if(!data.payload){
      return alert('Не удалось авторизоваться');
    }
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
    }
    // dispatch(fetchAuth(values));
  };

  if(isAuth) {
    return <Navigate to="/" />
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Введите почту'})}
          fullWidth
        />
        <TextField className={styles.field} 
        label="Пароль" 
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', { required: 'Введите пароль'})}
        fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
