// async function getCountsDays() {
//     const selectedDate = document.getElementById("countDays").value;
//     console.log("Selected date 2:", selectedDate);

//     try {
//         const response = await fetch(`/getcntDay/${selectedDate}`);
//         const getCounts = await response.json();
//         const dCounts = JSON.parse(getCounts);
//         document.getElementById("getDays").innerHTML ="ข้อมูลในวันที่ "+ selectedDate +" : "+ dCounts;
//         console.log("Counts:", dCounts);
//     } catch (error) {
//         console.error("Error fetching OID values:", error);
//     }
// }
// document.addEventListener("DOMContentLoaded", function () {
//     const selectElement = document.getElementById("countDays");
//     selectElement.addEventListener("change", getCountsDays);
// });


// async function getCountsDays() {
//     const selectedDate = document.getElementById("countDays").value;
//     console.log("Selected date 2:", selectedDate);

//     try {
//         const response = await fetch(`/getcntDay/${selectedDate}`);
//         const getCounts = await response.json();

//         // เมื่อต้องการแสดงข้อความใน HTML ให้ใช้ template literals
//         document.getElementById("getDays").innerHTML = `
//             <p>ข้อมูลในวันที่ ${selectedDate}:</p>
//             <p>จำนวน no helmet: ${getCounts[0]}</p>
//             <p>จำนวน rider: ${getCounts[1]}</p>
//         `;
//         console.log("Counts:", getCounts);
//     } catch (error) {
//         console.error("Error fetching OID values:", error);
//     }
// }

// document.addEventListener("DOMContentLoaded", function () {
//     const selectElement = document.getElementById("countDays");
//     selectElement.addEventListener("change", getCountsDays);
// });





async function getCountsDays() {
    const selectedDate = document.getElementById("countDays").value;
    console.log("Selected date 2:", selectedDate);

    try {
        const response = await fetch(`/getcntDay/${selectedDate}`);
        const getCounts = await response.json();

        // สร้างกราฟเมื่อมีข้อมูล
        createBarChart(selectedDate, getCounts[0], getCounts[1]);

        // แสดงข้อมูลใน HTML
        document.getElementById("getDays").innerHTML = `
            <p>ข้อมูลในวันที่ ${selectedDate}:</p>
            <p>จำนวน no helmet: ${getCounts[0]}</p>
            <p>จำนวน rider: ${getCounts[1]}</p>
        `;
        console.log("Counts:", getCounts);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}

let myChart = null; // สร้างตัวแปรเพื่อเก็บอ้างอิง Canvas ของกราฟ

function createBarChart(selectedDate, noHelmetCount, riderCount) {
    const ctx = document.getElementById("myChart").getContext("2d");

    // ถ้ามีกราฟเก่าอยู่ให้ทำลาย
    if (myChart) {
        myChart.destroy();
    }

    // สร้างตัวแปร data สำหรับกราฟแท่ง
    const data = {
        labels: [selectedDate],
        datasets: [
            {
                label: 'No Helmet',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                barThickness: 'flex',
                data: [noHelmetCount]
            },
            {
                label: 'ผู้ขับขี่',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barThickness: 'flex',
                data: [riderCount]
            }
        ]
    };

    //สร้างตัวแปร options สำหรับตั้งค่าของกราฟ
    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 15
                }
            }]
        }
    };

    // สร้างกราฟแท่ง
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
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
        document.getElementById("getMonths").innerHTML = "ข้อมูลในเดือน " + selectedMonths + " : " + mCount;
        console.log("Counts:", mCount);
    } catch (error) {
        console.error("Error fetching OID values:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("countMonths");
    selectElement.addEventListener("change", getCountsMonths);
});


