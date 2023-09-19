//반려동물선택 select box 세팅
let petList = ``
$('#select-pet').html('');
for (let i = 0; i < myPet.rowLength; i++) {
    petList += `<option value="${myPet.rows[i].pet_id}">${myPet.rows[i].pet_name}</option>`
}
$('#select-pet').html(petList);