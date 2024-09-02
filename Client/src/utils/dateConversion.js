const dateConversion = (stamp)=>{
    const date = new Date(stamp)
    const dateoptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    }
    const formattedDate = date.toLocaleString('ko-KR', dateoptions)
    return formattedDate
}

export default dateConversion