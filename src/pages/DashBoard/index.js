import './dashboard.css'

// importação de componentes
import Header from "../../components/Header"
import Modal from "../../components/Modal"
import Title from "../../components/Title"
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi"
import { Link } from "react-router-dom"


import { useContext ,useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, startAfter, query } from 'firebase/firestore'
import { db } from '../../services/firebaseConection';

import {format} from 'date-fns'
import { AuthContext } from '../../contexts/auth'
import { update } from 'firebase/database'

const listRef = collection(db, "chamados");

export default function DashBoard() {
    const { logOut } = useContext(AuthContext)

    const [chamados, setChamados] = useState([1]);
    const [loading, setLoading] = useState(true);

    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false)

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(()=>{
        async function loadChamados(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([]);

            await updateState(querySnapshot)

            setLoading(false);
        }
        loadChamados();

        return()=>{}
    },[])

    async function updateState(querySnapshot){

        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];

            querySnapshot.forEach((doc)=> {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]//pegando o ultimo item da lista

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc)

        }else{  
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    async function handleSearch(){
        setLoadingMore(true)

        const q = query(listRef,orderBy('created','desc'), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);

        await update(querySnapshot);
    }

    function toogleModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }



    if(loading){
        return(
            <div>
                <Header/>
                <div className='content'>
                    <Title name='Tickets'>
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Header />

            <div className="content">
                <Title name='Tickets'>
                    <FiMessageSquare size={25} />
                </Title>
                <>
                    {chamados.length === 0 ? (
                        <div className='container dashboard'>
                            <span>Nenhum chamado encontrado...</span>
                            <Link to={'/new'} className="new">
                                <FiPlus color="#fff" size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to={'/new'} className="new">
                                <FiPlus color="#fff" size={25} />
                                Novo Chamado
                            </Link>

                            <table> 
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index)=>{
                                        return(
                                        <tr key={index}>
                                        <td data-label="Cliente">{item.cliente}</td>
                                        <td data-label="Assunto">{item.assunto}</td>
                                        <td data-label="Status">
                                            <span className="badge" style={{ backgroundColor: item.status ==='Aberto' ? '#5cb85c' :  '#999' }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td data-label="Cadastrado">{item.createdFormat}</td>
                                        <td data-label="#">
                                            <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={()=>toogleModal(item)}>
                                                <FiSearch color="#fff" size={17} />
                                            </button>
                                            <Link to={`/new/${item.id}`} className="action">
                                                <FiEdit2 color="#fff" size={17} style={{ backgroundColor: '#f6a935' }} />
                                            </Link>
                                        </td>
                                    </tr>

                                    )})}
                                </tbody>
                            </table>
                            {loadingMore && <h3>Carregando mais chamados...</h3>}
                            {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleSearch}>Buscar mais chamados</button>}
                        </>
                    )}
                </>
            </div>
            {showPostModal && (
                <Modal
                    conteudo = {detail}
                    close= {()=> setShowPostModal(!showPostModal)}
                />)}
        </div>
    )
}