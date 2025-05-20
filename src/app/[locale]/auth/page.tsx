'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Tent } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAPI, registerAPI } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('auth');
  const toast = useToast();
  const router = useRouter();

  // Extend the user schema with more validation
  const loginSchema = z.object({
    username: z.string().min(1, t('validLoginEmail')),
    password: z.string().min(1, t('validLoginPassword')),
  });

  const registerSchema = z.object({
    username: z.string().min(1, t('validRegisterUsername')),
    email: z.string().email(t('validRegisterEmail')),
    phone: z.string()
      .min(1, t('validRegisterPhone1'))
      .refine(
        (value) => /^[0-9+\-\s()]*$/.test(value),
        t('validRegisterPhone2')
      )
      .refine(
        (value) => value.replace(/[^0-9]/g, "").length >= 8 && value.replace(/[^0-9]/g, "").length <= 15,
        t('validRegisterPhone3')
      ),
    password: z.string().min(6, t('validRegisterPassword')),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validRegisterConfirmPassword'),
    path: ["confirmPassword"],
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;
  type LoginFormValues = z.infer<typeof loginSchema>;

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    const res = await loginAPI(data.username, data.password);

    if (res?.data) {
      toast.success(t('loginSuccess'));

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      const messageKey = res.message_key;
      const fallbackMessage = res.message;

      let message;

      try {
        message = messageKey ? t(messageKey) : fallbackMessage;
      } catch {
        message = fallbackMessage || 'Unknown error';
      }

      toast.error(message);
    }

    //Reset login form
    loginForm.reset({
      username: "",
      password: "",
    });

    setIsLoading(false);
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    const res = await registerAPI(data.username, data.email, data.password, data.phone);

    if (res?.data) {
      toast.success(t('registerSuccess'));
      setActiveTab('login');
    } else {
      const messageKey = res.message_key;
      const fallbackMessage = res.message;

      let message;

      try {
        message = messageKey ? t(messageKey) : fallbackMessage;
      } catch {
        message = fallbackMessage || 'Unknown error';
      }

      toast.error(message);
    }

    //Reset register form
    registerForm.reset({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    setIsLoading(false);
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmitLogin = async (data: LoginFormValues) => {
    await handleLogin(data);
  };

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitRegister = async (data: RegisterFormValues) => {
    await handleRegister(data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-canvas">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Tent className="h-12 w-12 text-forest" />
            </div>
            <h1 className="text-3xl font-bold font-montserrat text-forest">{t('welcome')}</h1>
            <p className="text-charcoal mt-2">{t('subtitle')}</p>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="login">{t('loginBtn')}</TabsTrigger>
              <TabsTrigger value="register">{t('registerBtn')}</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">{t('loginTitle')}</CardTitle>
                  <CardDescription>
                    {t('loginDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('email')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('enterEmail')}
                                {...field}
                                autoComplete="username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('password')}</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t('enterPassword')}
                                {...field}
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-forest hover:bg-opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('loggingIn')}
                          </>
                        ) : (
                          t('loginBtn')
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    {t('noAccount')}{" "}
                    <Button
                      variant="link"
                      className="p-0 text-campfire"
                      onClick={() => setActiveTab("register")}
                    >
                      {t('registerHere')}
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">{t('registerTitle')}</CardTitle>
                  <CardDescription>
                    {t('registerDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('username')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('enterUsername')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('email')}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t('enterEmail')}
                                {...field}
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('phone')}</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder={t('enterPhone')}
                                {...field}
                                autoComplete="tel"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('password')}</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t('createPassword')}
                                {...field}
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('confirmPassword')}</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t('confirmYourPassword')}
                                {...field}
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-forest hover:bg-opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('creatingAccount')}
                          </>
                        ) : (
                          t('registerBtn')
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    {t('haveAccount')}{" "}
                    <Button
                      variant="link"
                      className="p-0 text-campfire"
                      onClick={() => setActiveTab("login")}
                    >
                      {t('loginHere')}
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="md:w-1/2 bg-cover bg-center flex flex-col justify-center p-8 text-white min-h-[400px] md:min-h-screen"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1571687949921-1306bfb24b72)',
          backgroundSize: 'cover'
        }}
      >
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold font-montserrat mb-4">{t('discoverTitle')}</h2>
          <p className="text-lg mb-6">
            {t('joinCommunity')}
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-campfire rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <span>{t('feature1')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-campfire rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <span>{t('feature2')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-campfire rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <span>{t('feature3')}</span>
            </li>
            <li className="flex items-start">
              <span className="bg-campfire rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <span>{t('feature4')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 