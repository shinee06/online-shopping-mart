export default class User {
  constructor({ id = null, fullName = '', email = '', phone = '', address = '', role = 'customer' } = {}) {
    this.id = id === null ? null : Number(id)
    this.fullName = String(fullName).trim()
    this.email = String(email).trim().toLowerCase()
    this.phone = String(phone).trim()
    this.address = String(address).trim()
    this.role = String(role).trim().toLowerCase()
  }

  toJSON() {
    return {
      ...(this.id === null ? {} : { id: this.id }),
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      role: this.role
    }
  }
}
