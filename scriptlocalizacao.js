// Executa quando a página terminar de carregar
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página de localização carregada com sucesso!");
    
    // Opcional: Animação suave de entrada para o card do mapa
    const mapCard = document.querySelector('.map-card');
    if (mapCard) {
        mapCard.style.opacity = '0';
        mapCard.style.transform = 'translateY(20px)';
        mapCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            mapCard.style.opacity = '1';
            mapCard.style.transform = 'translateY(0)';
        }, 100);
    }
});