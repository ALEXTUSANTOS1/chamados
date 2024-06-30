import { FiUser } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConection";

export default function Customers() {
    const[nome, setNome] = useState('')
    const[endereco, setEndereco] = useState('')
    const[cnpj, setCnpj] = useState('')

    async function salvaCliente(e){
        e.preventDefault()
        
        if(nome !== '' && endereco !== '' && cnpj !== ''){
            await addDoc(collection(db, "customers"),{
                nomeFantasia: nome,
                endereco: endereco,
                cnpj: cnpj
            })
            .then(()=>{
                setNome('')
                setEndereco('')
                setCnpj('')
                toast.success('Cliente Cadastrado com sucesso')
            })
            .catch((error)=>{
                console.log(error)
                toast.error('Erro ao cadastrar')
            })
        }else{
            toast.warning('Por favor, preencha todos os campos')
        }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name='Clientes'>
                    <FiUser size={25} />
                </Title>

                <div className="container">
                    <form onSubmit={salvaCliente} className="form-profile">
                        <label>Nome Fantasia</label>
                        <input
                            type="text"
                            placeholder="Nome da Empresa"
                            value={nome}
                            onChange={(e)=> setNome(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input
                            type="text"
                            placeholder="Cnpj da Empresa"
                            value={cnpj}
                            onChange={(e)=> setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input
                            type="text"
                            placeholder="Endereço da Empresa"
                            value={endereco}
                            onChange={(e)=> setEndereco(e.target.value)}
                        />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}