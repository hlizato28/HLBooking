import { Component, OnInit } from '@angular/core';
import { IBooking } from 'src/app/interfaces/i-booking';
import { IPagination } from 'src/app/interfaces/i-pagination';
import { BookingService } from 'src/app/services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  allBooking?: IBooking[];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  dataBooking: IBooking;
  displayEditModal: boolean = false;
  searchTerm: string = '';

  constructor(private bookingService: BookingService) {

    this.dataBooking = {
      idBooking: 0, 
      namaLapangan: '', 
      tanggal: '',
      jamMulaiBooking: [],
      jamSelesaiBooking: [],
      member: '',
      noTelepon: ''
    }
  }

  ngOnInit() {
    this.loadAllBooking({ page: this.currentPage - 1, size: this.itemsPerPage });
  }

  formatTime(timeArray: number[]): string {
    return `${timeArray[0].toString().padStart(2, '0')}:${timeArray[1].toString().padStart(2, '0')}`;
  } 

  formatDate(dateArray: number[]): string {
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  loadAllBooking(pagination?: IPagination) {
    const defaultPagination = { page: 0, size: this.itemsPerPage };

    const params: IPagination = pagination ? { 
      ...pagination, searchTerm: this.searchTerm 
    } : { 
      ...defaultPagination, searchTerm: this.searchTerm 
    };


    this.bookingService.getAllBooking(params).subscribe({
      next: (response: any) => { 
        if (response && response.content && Array.isArray(response.content)) {
            this.allBooking = response.content.map((item: any) => ({
                idBooking: item.idBooking,
                namaLapangan: item.namaLapangan,
                tanggal: this.formatDate(item.tanggal),
                jamMulaiBooking: this.formatTime(item.jamMulaiBooking),
                jamSelesaiBooking: this.formatTime(item.jamSelesaiBooking),
                member: item.member,
                noTelepon: item.noTelepon
            }));
            this.totalItems = response.totalElements;
        } else {
            this.allBooking = [];
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
    this.loadAllBooking({ page: newPage - 1, size: this.itemsPerPage });
  }

  onEdit(idBooking: number): void {
    if (this.allBooking) {
        const foundBooking = this.allBooking.find(booking => booking.idBooking === idBooking);
        if (foundBooking) {
            this.dataBooking = foundBooking;
            this.displayEditModal = true;
        } else {
            console.error('Booking dengan ID yang diberikan tidak ditemukan.');
        }
    } else {
        console.error('Data Booking tidak tersedia.');
    }
  }

  saveEdit(): void {
    if (this.dataBooking.idBooking !== undefined) {
      
      this.bookingService.editBooking(this.dataBooking.idBooking, this.dataBooking).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Data Booking berhasil diubah!', 'success');
          this.displayEditModal = false;
          this.loadAllBooking({ page: this.currentPage - 1, size: this.itemsPerPage });
        },
        error: (error) => {
          Swal.fire('Error', 'Gagal mengedit data booking!', 'error');
          this.displayEditModal = false;
        }
      });
    } else {
      Swal.fire('Error', 'Data booking tidak lengkap atau ID tidak tersedia!', 'error');
      this.displayEditModal = false;
    }
  }  

  confirmDelete(idAdmin: number, idLapangan: number): void {
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
            this.deleteBooking(idAdmin, idLapangan);
        }
    });
  }

  deleteBooking(idAdmin: number, idLapangan: number): void {
    this.bookingService.deleteBooking(idAdmin, idLapangan).subscribe({
        next: (response) => {
            Swal.fire(
                'Deleted!',
                'Data telah terhapus.',
                'success'
            );
            this.loadAllBooking();
        },
        error: (error) => {
            Swal.fire('Error', 'Failed to delete data booking: ' + error.message, 'error');
        }
    });
  }

  onSearchInput() {
    this.currentPage = 1;
    this.loadAllBooking();
  }
}
