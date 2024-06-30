import { FiPlusCircle } from 'react-icons/fi'
import Header from '../../components/Header'
import Title from '../../components/Title'

import './new.css'
import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'


const listRef = collection(db, 'customers');

export default function New() {
    const { user } = useContext(AuthContext)
    const { id } = useParams();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)
    const [idCustomer, setIdCustomer] = useState(false)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')

    useEffect(() => {
        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })
                    if (snapshot.docs.size === 0) {
                        toast.warning('Nenhum cliente encontrado')
                        setLoadCustomer(false);
                        return;
                    }

                    setCustomers(lista)
                    setLoadCustomer(false)

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log(error)
                    setLoadCustomer(false);
                    setCustomers([{ id: '1', nomeFantasia: 'Freela' }])
                })
        }

        loadCustomers();
    }, [id])

    async function loadId(lista) {
        const docRef = doc(db, 'chamados', id);

        await getDoc(docRef)

            .then((snapshot) => {
                setAssunto(snapshot.data().assunto)
                setStatus(snapshot.data().status)
                setComplemento(snapshot.data().complemento)


                let index = lista.findIndex(item => item.id === snapshot.data().clienteID)

                setCustomerSelected(index);
                setIdCustomer(true);
            })
            .catch((error) => {
                console.log(error)
                setIdCustomer(false)
            })
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleOptionSelect(e) {
        setAssunto(e.target.value)
        console.log(assunto)
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault()

        if (idCustomer) {
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteID: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userUid: user.uid,
            })
            .then(()=>{
                toast.info('Editando editado')
                setCustomerSelected(0)
                setComplemento('')
                navigate('/dashboard')
            })
            .catch((error)=>{
                toast.error('Erro ao atualizar')
                console.log(error)
            })
            return;
        }

        // Registrar os chamados
        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteID: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userUid: user.uid,
        })
            .then(() => {
                toast.success("Chamado registrado com sucesso")
                setComplemento('')
                setCustomerSelected(0)
                navigate('/dashboard')
            })
            .catch((error) => {
                toast.error("Erro ao abrir o chamado")
            })
    }
    return (
        <div>
            <Header />

            <div className="content">
                <Title name={id ? "Editando chamado" : "novo chamado"}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>

                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando ..." />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita tecnica'>Visita tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type='radio'
                                name='radio'
                                value='Aberto'
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Em Aberto</span>
                            <input
                                type='radio'
                                name='radio'
                                value='Progresso'
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>
                            <input
                                type='radio'
                                name='radio'
                                value='Concluido'
                                onChange={handleOptionChange}
                                checked={status === 'Concluido'}
                            />
                            <span>Concluido</span>
                        </div>

                        <label>Informações complementares</label>
                        <textarea
                            type='text'
                            placeholder='Descreva seu problema (Opcional)'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}