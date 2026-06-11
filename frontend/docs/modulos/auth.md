# Modulo Auth (Autenticacao)

## Objetivo

Gerenciar autenticacao de usuarios: login, registro, reset de senha e
verificacao de elegibilidade do Firebase para o sistema.

## Arquivos Envolvidos

| Area | Arquivos |
| --- | --- |
| Paginas | `pages/LoginPage.tsx`, `pages/RegisterPage.tsx` |
| Componentes | `components/AuthBrandPanel.tsx`, `components/LoginForm.tsx`, `components/RegisterForm.tsx`, `components/ResetPasswordModal.tsx` |
| Hook | `hooks/useAuthController.ts`, `hooks/useLoginPage.ts`, `hooks/useRegisterPage.ts` |
| Service | `services/authService.ts` |
| Schemas | `schemas/loginSchema.ts`, `schemas/registerSchema.ts` |
| Estilos | `styles/authStyles.ts` |
| Utils | `utils/formatadoresAuth.ts` |

## Fluxo

```txt
(anonimo)
  / ou /login  -> LoginPage  -> LoginForm
    -> useAuthController.login(email, senha)
      -> signInWithEmailAndPassword (Firebase)
      -> verifica elegibilidade (backend /auth/check-eligibility)
      -> redireciona para /dashboard

  /register    -> RegisterPage -> RegisterForm
    -> useAuthController.register(email, senha, dados)
      -> createUserWithEmailAndPassword (Firebase)
      -> atualiza perfil no Firestore
      -> backend valida e registrar
      -> redireciona para /dashboard
```

## Componentes E Hooks

| Nome | Responsabilidade |
| --- | --- |
| `LoginPage` | Tela de login com layout de marca |
| `RegisterPage` | Tela de registro |
| `AuthBrandPanel` | Painel lateral com logotipo e identidade visual |
| `LoginForm` | Formulario de email/senha com react-hook-form + Yup |
| `RegisterForm` | Formulario de registro completo |
| `ResetPasswordModal` | Modal para enviar email de redefinicao de senha |
| `useAuthController` | Hook orquestrador: login, registro, logout, reset, listener de auth |
| `useLoginPage` | Estado e callbacks especificos da pagina de login |
| `useRegisterPage` | Estado e callbacks especificos da pagina de registro |

## Imports E Dependencias

| Dependencia | Uso |
| --- | --- |
| `firebase/auth` | `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`, `sendPasswordResetEmail` |
| `react-hook-form` + `@hookform/resolvers/yup` | Gerenciamento de formulario com validacao Yup |
| `shared/services/api.ts` | Verificacao de elegibilidade no backend |
| `shared/config/firebase.ts` | Instancia do Firebase Auth |

## Regras E Cuidados

- `onAuthStateChanged` e o unico listener de auth confiavel para estado global.
- `PrivateRoute` em `routes.tsx` redireciona para `/login` se nao ha usuario.
- Reset de senha usa `sendPasswordResetEmail` do Firebase diretamente.
- A verificacao de elegibilidade consulta o backend para confirmar se o
  usuario pode acessar o sistema (cargo, vinculo).
- Nao armazenar token de autenticacao em localStorage ou sessionStorage —
  o Firebase SDK gerencia tokens internamente.
- Toda chamada `fetchAPI` injeta o token automaticamente via
  `shared/services/api.ts`.

## Testes Relacionados

| Tipo | Arquivos |
| --- | --- |
| Pagina Login | `tests/features/auth/pages/LoginPage.test.tsx` |
| Pagina Register | `tests/features/auth/pages/RegisterPage.test.tsx` |
| LoginForm | `tests/features/auth/components/LoginForm.test.tsx` |
| RegisterForm | `tests/features/auth/components/RegisterForm.test.tsx` |
| ResetPasswordModal | `tests/features/auth/components/ResetPasswordModal.test.tsx` |
| Hook | `tests/features/auth/hooks/useAuthController.test.tsx` |
| Service | `tests/features/auth/services/authService.test.ts` |
