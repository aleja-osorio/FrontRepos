import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/auth';

// Esquema de validación
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
    .matches(/^(?!\s)(?!.*\s$)/, 'La contraseña no puede contener espacios al inicio o final')
    .matches(/\d/, 'La contraseña debe contener al menos 1 número')
    .matches(/[A-Z]/, 'La contraseña debe contener al menos 1 letra mayúscula'),
});

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.register(data);
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl">🍕</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para acceder al sistema POS
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <Input
                {...register('fullName')}
                placeholder="Tu nombre completo"
                error={errors.fullName?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="usuario@ejemplo.com"
                error={errors.email?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
              />
            </div>
          </div>
          {error && <p className="text-center text-red-600 text-sm">{error}</p>}
          {success && <p className="text-center text-green-600 text-sm">{success}</p>}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 