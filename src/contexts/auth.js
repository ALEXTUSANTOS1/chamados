import { useState, createContext,useEffect } from "react";
import {auth, db} from '../services/firebaseConection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export default function AuthPrivider({children}){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    // Verifica de o usuario esta logado
    useEffect(()=>{
        async function loadUser(){
            const storageUser = localStorage.getItem('@chamadosPRO')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        loadUser();
    }, [])

    // Função de Login
    async function signIn(email, passowrd){
        setLoadingAuth(true)

        signInWithEmailAndPassword(auth, email, passowrd)
        .then(async(value)=>{
            let uid = value.user.uid

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data.avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo de volta! ' + data.nome);
            navigate('/dashboard')
        })
        .catch((error)=>{
            console.log(error)
            setLoadingAuth(false)
            toast.error('Erro ao acessar! ' )
        })
    }

    // cadastrar usuario
    async function signUp(email, passowrd, name){
        setLoadingAuth(true)

        await createUserWithEmailAndPassword(auth, email, passowrd)
        .then(async(value)=>{
            let uid = value.user.uid

            await setDoc(doc(db, "users", uid), {
                nome: name,
                avatarUrl: null
            })
            .then(()=>{

                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success('Usuário cadastrado com sucesso!')
                navigate('/dashboard')
            })
        })
        .catch((error)=>{
            console.log(error)
            setLoadingAuth(false)
        })
    }

    // Função de Guardar dados no local storage
    function storageUser(data){
        localStorage.setItem('@chamadosPRO', JSON.stringify(data))
    }

    async function logOut(){
        await signOut(auth);
        localStorage.removeItem('@chamadosPRO');
        setUser(null)
    }
    return(
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logOut,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}