import React, { useEffect, useState } from "react"

import { 
  TabContent,
  TabPane,
  Card,
  CardHeader,
  Button,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  FormGroup
} from "reactstrap"

import { FaEye, FaPencilAlt } from 'react-icons/fa';
import {GrConfigure } from 'react-icons/gr';

import Cookies from 'js-cookie';

//Componentes
import NuevoExpediente from './NuevoExpediente';
import DataTable from '../DataTable/DataTable';

//jsons de prueba
import listExpediente from './Json/listExpediente.json';

// Redux
import { connect } from "react-redux";
//actions
import {
  setListaExpediente,
  setFilasListaExpedienteActivos,
  setFilasListaExpedienteInactivos
} from '../../store/actions'

//columnas -tabla Expedientes
import {columnasTabla} from './Json/columnasExpediente';

const Expediente = props =>{
  const[listaExpediente, setListaExpediente] = useState([]);
  const[filasListaExpediente, setFilasListaExpediente] =useState([]);

//const [tokenU, setTokenU] = useState(null);
    //Ciclo de vida
    useEffect(()=>{
      _obtenerServicios(listExpediente);
  },[])

  useEffect(()=>{
       //  console.log("vino aqui");
    setListaExpediente(props.state.listaExpediente);
    let result =  _crearFilasListaExpediente();
  },[props.state.listaExpediente]) //detecta cambios en la lista de Expediente en el reducer y vuelve a formar las filas.

  useEffect(()=>{
      //console.log("valor de filas detectadas: ", props.state.filasListaUsuariosActivos)
      const _setearFilas =async()=>{
          await setFilasListaExpediente(props.state.filasListaExpedienteActivos);
      }
      _setearFilas();
  },[props.state.filasListaExpedienteActivos]) //detecta cambios en las filas en el reducer y las setea en el estado local - de momento, inutil.
  //Fin ciclo de vida



/*

    useEffect(()=>{
        //obteniendo el token almacenado en las cookies 
    _obtener_token();
      
    },[])

    useEffect(()=>{
        //effect que escucha los cambios del estado: tokenU
        console.log(tokenU);

    },[tokenU])


    const _obtener_token=async()=>{
        let token = Cookies.get('token');
        await setTokenU(token);
    }
    */

    //Función que simula la inicialización de servicios.
    const _obtenerServicios=async(listaExpediente)=>{
      /* simulando la llamada a un servicio */

      await props.setListaExpediente(listaExpediente);
          

  }


    //Función que llama a los usuarios en el servidor.
    const _obtenerExpediente = async(listaExpediente) =>{
      //console.log("valor del JSON en el llamado: ", listaUsuarios);
      await props.setListaExpediente(listaExpediente);
  }



    //Función que sirve de puerto en cambios obtenidos por componentes hijos.
    const _cambiosEnExpediente =({tipo, valor})=>{
      console.log("vino al cambio usuarios con: ", tipo);
      switch(tipo){
          case 'agregarExpedienteLista':
                  let nueva_lista =_agregarExpedienteALista(valor);
                  //console.log("lo que devolvio: ", nueva_lista);
                  _obtenerExpediente(nueva_lista);
              break;
          case 'editarExpedienteLista':
              //console.log(valor, "deeee");
                  let lista_actualizada =_actualizarExpediente(valor);
                  //console.log("lo devuelto: ", lista_actualizada);
                  _obtenerExpediente(lista_actualizada);
              break;

          default:
              break;
      }
  }


    //Función que crea las filas a partir de la lista de usuarios optenida.
    const _crearFilasListaExpediente=async()=>{
      //console.log("detecto el cambio");

      let filas=[];

      props.state.listaExpediente.map(Expediente=>{

          let {id_expediente,
              nombre_paciente, 
              sexo, 
              saldo,
              telefono,
              ultima_fecha
               } = Expediente;


          let fila ={};
          fila.id_expediente = id_expediente;
          fila.nombre_paciente = nombre_paciente;
          fila.sexo = sexo;
          fila.saldo = saldo;
          fila.telefono = telefono;
          fila.ultima_fecha = ultima_fecha;

          // fila.
          
          fila.operaciones="Coming soon";
              let defaultValues={
                  id_expediente:id_expediente,
                  nombre_paciente: nombre_paciente,                
                  sexo: sexo,
                  saldo: saldo,
                  telefono: telefono,
                  ultima_fecha: ultima_fecha
              }
          fila.operaciones=(
              < FormGroup>
              <NuevoExpediente
                  isReadOnly={true}
                  defaultValue={defaultValues}
                  classNames={"btn btn-success btn-sm "}
                  mensajeBoton={<FaEye />}
              />{' '}
              <NuevoExpediente 
                  defaultValue={defaultValues}
                  classNames={"btn btn-danger btn-sm "}
                  mensajeBoton={<FaPencilAlt />}
                  isEditable={true}
                  cambioDatos={_cambiosEnExpediente}
              />
              </FormGroup>
          )
          filas.push(fila);
      })
      props.setFilasListaExpedienteActivos(filas);

  }

  //Función que simula el añadir el tipo expediente obtenido para anexarlo al JSON - temporal.
  const _agregarExpedienteALista = (nuevo_expediente)=>{
    console.log("el nuevo ", nuevo_expediente);

    let { listaExpediente } = props.state;

    let n_lista = [];

    listaExpediente.map(Expediente_it =>{
        let Expediente = {...Expediente_it};
        n_lista.push(Expediente);

    });

    let Expediente ={};
    Expediente.id_expediente = listaExpediente.length + 1;
    Expediente.nombre_paciente = nuevo_expediente.nombre_paciente;
    Expediente.sexo = nuevo_expediente.sexo;
    Expediente.saldo = nuevo_expediente.saldo;
    Expediente.telefono = nuevo_expediente.telefono;
    Expediente.ultima_fecha = nuevo_expediente.ultima_fecha;

    n_lista.push(Expediente);
    //console.log("la lista antes de ingresar ", n_lista);
  return n_lista;

};


    //Función que simula la actualización en la data de un tipo expediente.
    const _actualizarExpediente = (expediente_actualizar)=>{

      console.log("AHORITA ENTRO A ACTUALIZAR");
      let { listaExpediente } = props.state;

      let n_lista = [];

      listaExpediente.map(Expediente_it =>{
          let Expediente = {...Expediente_it};

          if(Expediente.id_expediente == expediente_actualizar.id_expediente)
          {
            console.log("entro al if ENTRO A ACTUALIZAR");
              //console.log("coincidencia: ",Expediente.id_expediente);
              Expediente.nombre_paciente = expediente_actualizar.nombre_paciente;
              Expediente.sexo = expediente_actualizar.sexo;
              Expediente.saldo = expediente_actualizar.saldo;
              Expediente.telefono = expediente_actualizar.telefono;
              Expediente.ultima_fecha = expediente_actualizar.ultima_fecha;
    }
          n_lista.push(Expediente);

      });

     
    return n_lista;
  }

    return(
        <React.Fragment>
        <div className="page-content">
        <Container fluid={true}>
        <Card>
                <CardBody>
                  <h4><i className="fas fa-stethoscope"><i className="far fa-file-alt"></i></i> 
                  <b>Gestión de Expedientes </b></h4>
                    <br/>
                    <Row>
                    <Col md={4} xs={12}>
                    
                        <NuevoExpediente 
                            cambioDatos={_cambiosEnExpediente}
                        />
                    </Col>
                  </Row>

                  <Row>
                      <Col md={12} xs={12}>
                            <DataTable datosTabla={props.state.filasListaExpedienteActivos} columnasTabla={columnasTabla}
                                /> 
                      </Col>
                  </Row>



                </CardBody>
        </Card>
        </Container>
        </div>
        </React.Fragment>
    )
}



const mapStateToProps = reducers => {
    return{
      state: reducers.ExpedienteReducer
    }
  }
  

const mapDispatchToProps = dispatch =>{
    return{
        setExpediente: (datos) =>dispatch(setListaExpediente(datos)),
        setListaExpediente: (datos) =>dispatch(setListaExpediente(datos)),
        setFilasListaExpedienteActivos: (datos) =>dispatch(setFilasListaExpedienteActivos(datos)),
        setFilasListaExpedienteInactivos: (datos) =>dispatch(setFilasListaExpedienteInactivos(datos))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Expediente);


