/* GOOGLE FONT IMPORT */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');

/* RESET & GLOBAL STYLES */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto Condensed', sans-serif;
}

body {
    background: #fff;
    color: #212121;
}

a {
    text-decoration: none;
    color: inherit;
}

/* HEADER */
header {
    width: 100%;
    background: #fff;
    padding: 15px 50px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.navbar .logo {
    font-size: 28px;
    font-weight: 700;
    color: #f2bd12;
}

.navlist {
    display: flex;
    list-style: none;
    gap: 30px;
}

.navlist li a {
    font-weight: 500;
    transition: 0.3s;
}

.navlist li a:hover {
    color: #f2bd12;
}

.desktop-action {
    display: flex;
    align-items: center;
    gap: 20px;
}

.desktop-action .btn {
    padding: 8px 16px;
    background: #f2bd12;
    color: #212121;
    border-radius: 5px;
    font-weight: 600;
}

.desktop-action .cart-icon {
    position: relative;
    font-size: 20px;
}

.cart-value {
    position: absolute;
    top: -8px;
    right: -10px;
    background: red;
    color: #fff;
    font-size: 12px;
    border-radius: 50%;
    padding: 2px 6px;
}

/* HERO SECTION */
.hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 50px;
    gap: 50px;
}

.hero-section .content {
    max-width: 500px;
}

.hero-section h1 {
    font-size: 48px;
    line-height: 1.2;
}

.hero-section h1 span {
    color: #f2bd12;
}

.hero-section p {
    margin: 20px 0;
    font-size: 18px;
}

.hero-section .flex {
    display: flex;
    align-items: center;
    gap: 15px;
}

.hero-section .btn {
    background: #f2bd12;
    color: #212121;
    padding: 10px 20px;
    border-radius: 5px;
}

.hero-section .social-icon {
    font-size: 20px;
    color: #212121;
}

/* SERVICES */
.services {
    padding: 80px 50px;
    background: #f9f9f9;
}

.services .text-content h5 {
    color: #f2bd12;
    font-weight: 600;
}

.services .text-content h2 {
    font-size: 32px;
    margin: 10px 0 40px;
}

.service-cards {
    display: flex;
    gap: 20px;
    justify-content: space-between;
}

.service-card {
    background: #fff;
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    flex: 1;
}

.service-card img {
    height: 100px;
    margin-bottom: 20px;
}

.service-card h3 {
    margin-bottom: 10px;
    font-size: 20px;
}

.service-card p {
    font-size: 14px;
    color: #555;
}

/* MENU */
.menu {
    padding: 80px 50px;
}

.card-list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
}

.order-card {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    flex: 1 1 calc(25% - 20px);
}

.order-card img {
    width: 100%;
    border-radius: 12px;
    margin-bottom: 15px;
}

.order-card h4 {
    font-size: 18px;
    margin-bottom: 10px;
}

.order-card .price {
    color: #f2bd12;
    font-weight: 700;
    margin-bottom: 15px;
}

.order-card .btn {
    background: #f2bd12;
    color: #212121;
    padding: 8px 15px;
    border-radius: 5px;
}

/* REVIEWS */
.reviews {
    padding: 80px 50px;
    background: #f9f9f9;
}

.review-card {
    display: flex;
    gap: 15px;
}

.review-card .profile img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.stars {
    color: #f2bd12;
    margin: 5px 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    .hero-section {
        flex-direction: column;
        text-align: center;
    }
    .service-cards {
        flex-direction: column;
    }
    .card-list {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .navlist {
        display: none;
    }
    .desktop-action .hamburger {
        display: block;
    }
    .mobile-menu {
        display: none;
        flex-direction: column;
        gap: 10px;
        background: #fff;
        position: absolute;
        top: 70px;
        width: 100%;
        left: 0;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .mobile-menu.active {
        display: flex;
    }
}
