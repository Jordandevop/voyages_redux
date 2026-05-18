const getRegionColor = (region) => {
    const normalizedRegion = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    switch (normalizedRegion) {
        case "europe":
            return "primary";   
        case "afrique":
            return "warning";   
        case "asie":
            return "danger";    
        case "amerique":
            return "success";   
        case "oceanie":
            return "info";      
        default:
            return "secondary"; 
    }
};


export default getRegionColor;