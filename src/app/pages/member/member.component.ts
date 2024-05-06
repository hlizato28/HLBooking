import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/interfaces/i-member';
import { IPagination } from 'src/app/interfaces/i-pagination';
import { MemberService } from 'src/app/services/member.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member',
    templateUrl: './member.component.html',
  styleUrl: './member.component.css'
})
export class MemberComponent implements OnInit {

  allMember?: IMember[];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  dataMember: IMember;
  displayEditModal: boolean = false;
  searchTerm: string = '';

  constructor(private memberService: MemberService) {
    this.dataMember = {
      idUser: 0,
      username: '',
      email: '',
      nama: '',
      noTelepon: ''
    }
  }

  ngOnInit() {
    this.laodAllMember({ page: this.currentPage - 1, size: this.itemsPerPage });
  }

  laodAllMember(pagination?: IPagination) {
    const defaultPagination = { page: 0, size: this.itemsPerPage };

    const params: IPagination = pagination ? { 
      ...pagination, searchTerm: this.searchTerm 
    } : { 
      ...defaultPagination, searchTerm: this.searchTerm 
    };


    this.memberService.getAllMember(params).subscribe({
      next: (response: any) => { 
        if (response && response.content && Array.isArray(response.content)) {
            this.allMember = response.content.map((item: any) => ({
              idUser: item.idUser,
              userName: item.username,
              email: item.email,
              nama: item.nama,
              noTelepon: item.noTelepon
            }));
            this.totalItems = response.totalElements;
        } else {
            this.allMember = [];
            this.totalItems = 0;
            console.error('Invalid data format received:', response);
        }
    },
    error: (error) => {
        console.error('Failed to load Data Booking:', error);
    }
    });
  }


  onPageChanged(event: any) {
    const newPage = event?.page != null ? event.page + 1 : 1;
    this.laodAllMember({ page: newPage - 1, size: this.itemsPerPage });
  }

  onEdit(idUser: number): void {
    if (this.allMember) {
        const foundMember = this.allMember.find(member => member.idUser === idUser);
        if (foundMember) {
            this.dataMember = foundMember;
            this.displayEditModal = true;
        } else {
            console.error('Member dengan ID yang diberikan tidak ditemukan.');
        }
    } else {
        console.error('Data member tidak tersedia.');
    }
  }

  saveEdit(): void {
    if (this.dataMember.idUser !== undefined) {
      
      this.memberService.editMember(this.dataMember.idUser, this.dataMember).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Data member berhasil diubah!', 'success');
          this.displayEditModal = false;
          this.laodAllMember({ page: this.currentPage - 1, size: this.itemsPerPage });
        },
        error: (error) => {
          Swal.fire('Error', 'Gagal mengedit data member!', 'error');
          this.displayEditModal = false;
        }
      });
    } else {
      Swal.fire('Error', 'Data member tidak lengkap atau ID tidak tersedia!', 'error');
      this.displayEditModal = false;
    }
  } 

  confirmDelete(idUser: number): void {
    Swal.fire({
        title: 'Hapus Data',
        text: "Anda yakin ingin menghapus data?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then((result) => {
        if (result.isConfirmed) {
            this.deleteMember(idUser);
        }
    });
  }

  deleteMember(idUser: number): void {
    this.memberService.deleteMember(idUser).subscribe({
        next: (response) => {
            Swal.fire(
                'Deleted!',
                'Data telah terhapus.',
                'success'
            );
            this.laodAllMember();
        },
        error: (error) => {
            Swal.fire('Error', 'Failed to delete data member: ' + error.message, 'error');
        }
    });
  }

  onSearchInput() {
    this.currentPage = 1;
    this.laodAllMember();
  }

}
