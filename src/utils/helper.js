const getRegionColor = (region) => {
    if (!region) return "secondary";

    const normalizedRegion = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    switch (normalizedRegion) {
        case "europe":
            return "primary";   
        case "afrique":
            return "warning";   
        case "asie":
            return "danger";    
        case "amerique du nord":
        case "amerique du sud":
            return "success";   
        case "oceanie":
            return "info";    
        case "antarctique":
            return "dark";  
        default:
            return "secondary"; 
    }
};

export default getRegionColor;