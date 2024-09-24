const dateConversion = (stamp)=>{
    const date = new Date(stamp)
    const now = new Date()

    const diff = now - date

    const seconds = Math.floor(diff/1000)
    const minutes = Math.floor(seconds/60)
    const hours = Math.floor(minutes/60)
    const days = Math.floor(hours/24)
    const weeks = Math.floor(days/7)

    

    let formattedDate
    if(weeks > 3){
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        }
        formattedDate = date.toLocaleString('ko-KR', dateOptions)
    }else if(days > 0){
        formattedDate = `${days}일 전`
    }else if(hours > 0){
        formattedDate = `${hours}시간 전`
    }else if(minutes > 0){
        formattedDate = `${minutes}분 전`
    }else{
        formattedDate = "방금 전"
    }
    return formattedDate
}

export default dateConversion