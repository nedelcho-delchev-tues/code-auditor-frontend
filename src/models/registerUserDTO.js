export let registerUserDTO = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  faculty: "",
  facultyNumber: "",
  specialization: "",
  group: "",
  stream: "",
};

export function setUserData(data) {
  registerUserDTO.firstName = data.get("firstName");
  registerUserDTO.lastName = data.get("lastName");
  registerUserDTO.email = data.get("email");
  registerUserDTO.password = data.get("password");
  registerUserDTO.faculty = data.get("faculty");
  registerUserDTO.facultyNumber = data.get("facultyNumber");
  registerUserDTO.specialization = data.get("specialization");
  registerUserDTO.group = data.get("group");
  registerUserDTO.stream = data.get("stream");

  return registerUserDTO;
}

