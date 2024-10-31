function generateRandomNegative(){
    const positive = 1
    const negative = -1
    if(Math.random()>0.5){
        return positive
    } else{
        return negative
    }
}
export function generateRandomXYZPositionLessThan1000(){
        const xUpperBound = 200
        const yUpperBound = 400
        const zUpperBound = 200 
        const positionsArr = [
            xUpperBound*Math.random()*generateRandomNegative(),
            yUpperBound*Math.random(),
            zUpperBound*Math.random()*generateRandomNegative()
        ]
        return positionsArr
    }
