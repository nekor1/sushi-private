import { useNavigate } from "react-router-dom";
import { CART, HOME } from "../utils/const";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { a } from "../services/axiosinstance";


function Checkout(){

    const {clearCart, totalPrice, cartItems} = useCart();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Алматы',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleInpitChange(event){
        const {name, value} = event.target
        setFormData(function(prevData){
            return{
                ...prevData,
                [name]: value
            }
        })
    }

    async function hableSubmit(event) {
        event.preventDefault();
        if (!formData.name || !formData.phone ||!formData.address ||!formData.city){
            alert('Заполните все обязательные поля');
            return;
        }
        if (cartItems.length === 0){
            alert('Ваша корзина пуста. Нельзя оформить пустой заказ');
            navigate(HOME);
            return;
        }

        setIsSubmitting(true);

        const orderTimeStamp = new Date().toISOString();
        const orderData ={
            customer: formData,
            items: cartItems,
            totalPrice: totalPrice,
            orderTimeStamp: orderTimeStamp,
        };


        try {
            const res = await a.post('/orders', orderData);
            alert(`Ваш заказ принят! Сумма: ${totalPrice.toLocaleString()} тенге, Номер заказа: ${res.data.id}`);
            clearCart();
            navigate (HOME);
        } catch(error){
            console.error("Error: ", error);
            alert('Что то пошло не так');
        } finally{
            setIsSubmitting(false)
        }

    }



    return(
        <section class="block">
        <div class="container">
            <Link to={CART} class="back-btn">Назад</Link>
            <h1 class="title">Оформление заказа</h1>
            <form class="form" onSubmit={hableSubmit}>
                <div class="form-control">
                    <label htmlFor="name" class="label">Ваше имя</label>
                    <input
                        value={formData.name}
                        onChange={handleInpitChange}
                        disabled={isSubmitting}
                        type="text"
                        name="name" 
                        placeholder="Введите имя" 
                        required />
                </div>
                <div class="form-control">
                    <label htmlFor="phone" class="label">Номер телефона</label>
                    <input
                        value={formData.phone}
                        onChange={handleInpitChange}
                        disabled={isSubmitting}
                        pattern="\+7\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}"
                        type="text" 
                        name="phone" 
                        placeholder="Введите номер телефона: +7 XXX XXX XX XX"
                        required />
                </div>
                <div class="form-control">
                    <label htmlFor="address" class="label">Напишите адрес</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInpitChange}
                        disabled={isSubmitting}
                        placeholder="Введите адрес, дом, квартиру, домофон"
                        required
                    />
                </div>
                <div class="form-control">
                    <label htmlFor="city" class="label">Укажите город</label>
                    <select name="city" id="city" value={formData.city} onChange={handleInpitChange} disabled={isSubmitting}> 
                        <option value="Алмата">Алматы</option>
                        <option value="Астана">Астана</option>

                    </select>
                </div>
                <button class="send-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Заказ оформляется...' : 'Оформить заказ'}
                </button>
            </form>
        </div>
    </section>
    );
}

export default Checkout