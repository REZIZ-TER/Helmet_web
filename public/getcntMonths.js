async function getCountsDays() {
    const selectedDate = document.getElementById(
        "countDays"
    ).value;
    console.log("Selected date:", selectedDate);

    try {
        const response = await fetch(`/getcntDay/${selectedDate}`);
        const getCounts = await response.json();
        const Counts = JSON.parse(getCounts);
        document.getElementById("getCounts").innerHTML = Counts;
        console.log("Counts:", Counts);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}

// async function getCountsMonths() {
//     const selectedMonths = document.getElementById("countMonths").value;
//     console.log("Selected Month:", selectedMonths);

//     try {
//         const response = await fetch(`/getcntMonths/${selectedMonths}`);
//         const getCounts = await response.json();
//         const getCountsJsonString = JSON.stringify(getCounts);
//         const count = JSON.parse(getCountsJsonString).count;
//         document.getElementById("getCounts").innerHTML = count;
//         console.log("Counts:", count);
//     } catch (error) {
//         console.error("Error fetching OID values:", error);
//     }
// }

async function getCountsMonths() {
    const selectedMonths = document.getElementById("countMonths").value;
    console.log("Selected Month:", selectedMonths);

    try {
        const response = await fetch(`/getcntMonths/${selectedMonths}`);
        const getCounts = await response.json();
        const count = getCounts.count;
        document.getElementById("getMonths").innerHTML = count;
        console.log("Counts:", count);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const selectElement = document.getElementById("countMonths");
    selectElement.addEventListener("change", getCountsMonths);
});