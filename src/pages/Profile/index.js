import { useContext, useState } from 'react'

import { AuthContext } from '../../contexts/auth'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { db, storage } from '../../services/firebaseConection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import './profile.css'
import { toast } from 'react-toastify'


export default function Profile() {
    const { user, storageUser, setUser } = useContext(AuthContext);
    const [avatarImage, setAvatarImage] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e) {
        if (e.target.files[0]) {
            const img = e.target.files[0];

            if (img.type === 'image/jpeg' || img.type === 'image/png') {
                setAvatarImage(img)
                setAvatarUrl(URL.createObjectURL(img))
            } else {
                alert('Envie uma imagem com o formato JPEG ou PNG')
                setAvatarImage(null)
                return;
            }
        }
    }

    async function handleUpdate(){
        const currentUid = user.uid;

        const uploadRef = ref(storage,`images/${currentUid}/${avatarImage.name}`)
        const uploadTask = uploadBytes(uploadRef, avatarImage)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async(downloadUrl)=>{
                let urlFoto = downloadUrl;

                const docRef = doc(db,"users", user.uid)
                await updateDoc(docRef,{
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome : nome,
                        avatarUrl: urlFoto
                    }

                    setUser(data);
                    storageUser(data)

                    toast.success('Perfil atualizado com sucesso!')
                })
            })
        })

    }
   async function handleSubmit(e){
        e.preventDefault()

        if(avatarImage === null & nome !== ''){
            // atualizar apenas o nome
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef, {
                nome : nome,
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome : nome,
                }
            })
            setUser()
            storageUser()
            toast.success("Perfil atualizado com sucesso!")
        }else if(nome !== '' && avatarImage !== null){
            // Atualiza o nome e a imagem
            handleUpdate()
        }
    }
    return (
        <div>
            <Header />
            <div className='content'>
                <Title name='Minha Conta'>
                    <FiSettings size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>
                            <input type='file' accept='image/*' onChange={handleFile} /> <br />
                            {avatarUrl == null ? (
                                <img src={avatar} alt='Foto de Perfil' width={250} height={250} />
                            ) : (<img src={avatarUrl} alt='Foto de Perfil' width={250} height={250} />)}
                        </label>


                        <label>Nome</label>
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />


                        <label>Email</label>
                        <input type='text' value={email} disabled={true} />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}