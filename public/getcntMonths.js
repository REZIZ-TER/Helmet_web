async function getCountsDays() {
    const selectedDate = document.getElementById("countDays").value;
    console.log("Selected date:", selectedDate);

    try {
        const response = await fetch(`/getcntDay/${selectedDate}`);
        const getCounts = await response.json();
        const dCounts = JSON.parse(getCounts);
        document.getElementById("getDays").innerHTML ="ข้อมูลในวันที่ "+ selectedDate +" : "+ dCounts;
        console.log("Counts:", dCounts);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("countDays");
    selectElement.addEventListener("change", getCountsDays);
});

async function getCountsMonths() {
    const selectedMonths = document.getElementById("countMonths").value;
    console.log("Selected Month:", selectedMonths);

    try {
        const response = await fetch(`/getcntMonths/${selectedMonths}`);
        const getCounts = await response.json();
        const mCount = getCounts.count;
        document.getElementById("getMonths").innerHTML ="ข้อมูลในเดือน "+ selectedMonths +" : "+ mCount;
        console.log("Counts:", mCount);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("countMonths");
    selectElement.addEventListener("change", getCountsMonths);
});
