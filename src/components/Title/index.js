import './title.css'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';


export default function Title({ children, name }) {

    const {logOut} = useContext(AuthContext)

    return (
        <div className='title'>
            {children}
            <span>{name}</span>
            <div className='botao-sair'>
                <button onClick={()=> logOut()}>Sair</button>
            </div>
        </div>
    )
}