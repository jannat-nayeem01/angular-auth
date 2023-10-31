import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class UserService {
constructor(private http: HttpClient) { }
getAll(): any {
const subject = this.http.get<any[]>('/api/users');
return subject;
}
register(user): any {
const subject = this.http.post('/api/register', user);
return subject;
}
delete(id): any {
id = encodeURIComponent(id);
const subject = this.http.delete(`/api/users/${id}`);
return subject;
}
update(userData): any {
const subject = this.http.put(`/api/users/${userData.id}`, userData);
return subject;
}
}