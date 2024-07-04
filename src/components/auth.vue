<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="header-box">
        <div class="logo-title">
          <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
          <h1>Mis Gastos</h1>
        </div>
        <div class="header-text">
          <p class="tagline"><span class="checkmark">✔</span> Organiza tus gastos</p>
          <p class="tagline"><span class="checkmark">✔</span> Visualiza los datos que necesitas</p>
          <p class="tagline"><span class="checkmark">✔</span> Toma el control de tus finanzas</p>
        </div>
      </div>
      <div class="auth-box" v-if="!isRegister">
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="Ingrese su email" required />
          <input v-model="password" type="password" placeholder="Ingrese su contraseña" required />
          <button type="submit">Iniciar sesión</button>
        </form>
        <p @click="toggleRegistrarse">¿No tienes cuenta? Regístrate</p>
        <p v-if="loginError" class="error">{{ loginError }}</p>
      </div>

      <div class="auth-box" v-if="isRegister">
        <h2>Registrarse</h2>
        <form @submit.prevent="registro">
          <input v-model="emailRegistro" type="email" placeholder="Ingrese su email" required />
          <input v-model="passwordRegistro" type="password" placeholder="Ingrese su contraseña" required />
          <button type="submit">Registrarse</button>
        </form>
        <p @click="toggleRegistrarse">¿Ya tienes una cuenta? Inicia sesión</p>
        <p v-if="registroError" class="error">{{ registroError }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      emailRegistro: "",
      passwordRegistro: "",
      isRegister: false,
      loginError: "",
      registroError: "",
    };
  },
  methods: {
    async login() {
      if (this.email === "" || this.password === "") {
        this.loginError = "Por favor, complete todos los campos.";
        return;
      }
      try {
        this.loginError = "";
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        localStorage.setItem("userId", user.uid);
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        this.loginError = "Error al iniciar sesión. Verifica tus credenciales.";
      }
    },
    async registro() {
      if (this.emailRegistro === "" || this.passwordRegistro === "") {
        this.registroError = "Por favor, complete todos los campos.";
        return;
      }
      try {
        this.registroError = "";
        const userCredential = await createUserWithEmailAndPassword(auth, this.emailRegistro, this.passwordRegistro);
        const user = userCredential.user;
        localStorage.setItem("userId", user.uid);
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error al registrarse:", error.message);
        this.registroError = "Error al registrarse. Verifica tus datos.";
      }
    },
    toggleRegistrarse() {
      this.isRegister = !this.isRegister;
      this.loginError = "";
      this.registroError = "";
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&family=Raleway:wght@700&display=swap');

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('~@/assets/control-de-gastos.jpg');
  background-size: cover;
  background-position: center;
}

.auth-content {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.header-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;
}

.checkmark {
  color: green;
  margin-right: 0.5rem;
}

.logo-title {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  border-radius: 50%;
}

.header-text {
  text-align: center;
}

.header-text h1 {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.tagline {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: #555;
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.auth-box {
  text-align: center;
  width: 320px;
}

.auth-box h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
}

.auth-box form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-box input {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  width: 100%;
}

.auth-box input:focus {
  border-color: #007bff;
  outline: none;
}

.auth-box button {
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
}

.auth-box button:hover {
  background-color: #0056b3;
}

.auth-box .error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.auth-box p {
  margin-top: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.auth-box p:hover {
  color: #007bff;
  background-color: #e0e0e0;
}
</style>
