import "../styles/login.css";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

function SignUp() {
  
  const dispatch = useDispatch();
  const expcorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  const expcontraseña = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
  const expusuario = /^[a-zA-Z]{3,15}$/;

  const history = useNavigate();
  const [error, setError] = useState({});
  const [semail, setSemail] = useState("")
console.log("soy el log", semail);


const sendEmail = async(e)=>{
  e.preventDefault();
  const sendmessage = JSON.stringify({semail})
  const res = await fetch("http://localhost:3001/email", {
    method: "POST",
    body: sendmessage,
    headers:{
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  if(data.status === 401 || !data){
    console.log("error");
  }else{
    console.log("email send!");
  }
}
  //state para guardar el input del email y el password, y si hay mas input se añade a este objeto
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatpassword: "",
  });

  const handlerChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(
      validation({
        ...formData,
        [e.target.name]: e.target.value,
      })
    );
    setSemail(
   e.target.value,
  )
  };

  //se puede hacer un state por cada input
  // const[email,setEmail]=useState("");
  // const[password, setPassword]=useState("");

  //hacer nueva lidacion segun como se requieran los datos, dependiento de la forma de recibimieto de la db
  async function handlesubmit(e) {
    e.preventDefault();
    try {
      //envia la info de los inputs convertida a un json (formData)
      const data = JSON.stringify(formData);
      console.log(data);
      //envio un fecth a la url del servidor que va a la ruta del post de customers con un objeto de configuracion donde le paso el metodo de la request, el body que contiene la data en formato json y un header para especificar que es un json el que estoy  enviando
      await fetch("http://localhost:3001/login", {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
    }
    if (formData) {
      return (
        swal("¡ESTUPENDO!", "Ahora inicia sesión!", "success") &&
        history("/login")
      );
    }
  }
  /////////////////////////////////////////////
  /////
  ////
  ///
  //
  //state.id // formData.email = formData.email = return "correo ya existe"
  //
  ///
  ////
  /////
  //////////////////////////////////////
  function validation(formData) {
    let errors = {};
    if (!formData.username) {
      errors.username = "El usuario es requerido.";
    } else if (!expusuario.test(formData.username)) {
      errors.username =
        "Tu usuario debe contener más de 3 caracteres o no pasarte de los 15, y no puede contener numeros.";
    }
    if (!formData.email) {
      errors.email = "El email es requerido.";
    } else if (!expcorreo.test(formData.email)) {
      errors.email = "Esto no parece un email.";
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida.";
    } else if (!expcontraseña.test(formData.password)) {
      errors.password =
        "Tu contraseña debe tener al menos 8 caracteres, con al menos una letra minúscula, una mayúscula, un dígito y un caracter especial.";
    }
    if (!formData.repeatpassword) {
      errors.repeatpassword = "Repite tu contraseña.";
    } else if (formData.password !== formData.repeatpassword) {
      errors.repeatpassword = "Tu contraseña no coincide.";
    }
    return errors;
  }

  return (
    <div className="cuerpito">
      <div className="wrapper">
        <div className="container">
          <div className="col-left">
            <div className="login-text">
              <h2>¡Gracias por confiar en nosotros!</h2>
              <p>
                Create your account.
                <br />
                It's totally free.
              </p>
            </div>
          </div>
          <div className="col-right">
            <div className="login-form">
              <h2>Login</h2>

              <div>
                <form onSubmit={(e) => handlesubmit(e)}>
                  <p>
                    <label>
                      Usuario<span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Usuario"
                      required
                      value={formData.username}
                      name="username"
                      onChange={handlerChange}
                    />
                    {error.username && (
                      <p className="errors">{error.username}</p>
                    )}
                  </p>
                  <p>
                    <label>
                      Dirección de Correo<span>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={(e)=> handlerChange(e) }
                    />
                    {error.email && <p className="errors
                    ">{error.email}</p>}
                  </p>
                  <p>
                    <label>
                      Contraseña<span>*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      required
                      name="password"
                      onChange={handlerChange}
                    />
                    {error.password && (
                      <p className="errors">{error.password}</p>
                    )}
                  </p>
                  <p>
                    <label>
                      Repeat Password<span>*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.repeatpassword}
                      required
                      name="repeatpassword"
                      onChange={handlerChange}
                    />
                    {error.repeatpassword && (
                      <p className="errors">{error.repeatpassword}</p>
                    )}
                  </p>
                  <p>
                    <button
                      type="submit"
                      disabled={
                        error.username ||
                        error.email ||
                        error.password ||
                        error.repeatpassword
                      }
                    >
                      {" "}
                      Crear{" "}
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
