import React from 'react'
import style from "./home.module.css"
import { FaUserAlt, FaTasks, FaNewspaper, FaUsers  } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const home = () => {
  return (
    <section className={style.containerHome}>

        <section className={style.content}>
          <div className={style.info}>
          <FaUserAlt 
          
          className={style.icon}/>

          <p>Olá, Cristiane</p>
          </div>

          <div className={style.links}>

            <a href="/client" className={style.options}>
            <FaTasks /> Lista de clientes
            </a>
             <a href="" className={style.options}>
              <FaNewspaper />Documentos
             </a>
             
             <a href=""  className={style.options}>
             <FaUsers />Área Adm
             </a>
            

          </div>  

          <a href='/' className={style.logout}>
        <BiLogOut /> Sair
          </a>
        

        </section>

    
    </section>
  )
}

export default home