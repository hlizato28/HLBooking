import { getLocaleTimeFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ILapangan } from 'src/app/interfaces/i-lapangan';
import { IPagination } from 'src/app/interfaces/i-pagination';
import { LapanganService } from 'src/app/services/lapangan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lapangan',
  templateUrl: './lapangan.component.html',
  styleUrl: './lapangan.component.css'
})
export class LapanganComponent implements OnInit {
  allLapangan?: ILapangan[];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  dataLapangan: ILapangan;
  displayEditModal: boolean = false;
  displayCreateModal: boolean = false;
  searchTerm: string = '';

  constructor(private lapanganService: LapanganService) {

    this.dataLapangan = {
      idLapangan: 0, 
      namaLapangan: '', 
      jamMulai: [],
      jamSelesai: []
    }
  }

  ngOnInit() {
    this.loadAllLapangan({ page: this.currentPage - 1, size: this.itemsPerPage });
  }

  formatTime(timeArray: number[]): string {
    return `${timeArray[0].toString().padStart(2, '0')}:${timeArray[1].toString().padStart(2, '0')}`;
  } 

  loadAllLapangan(pagination?: IPagination) {
    const defaultPagination = { page: 0, size: this.itemsPerPage };

    const params: IPagination = pagination ? { 
      ...pagination, searchTerm: this.searchTerm 
    } : { 
      ...defaultPagination, searchTerm: this.searchTerm 
    };


    this.lapanganService.getAllLapangan(params).subscribe({
      next: (response: any) => { 
        if (response && response.content && Array.isArray(response.content)) {
            this.allLapangan = response.content.map((item: any) => ({
                idLapangan: item.idLapangan,
                namaLapangan: item.namaLapangan,
                jamMulai: this.formatTime(item.jamMulai),
                jamSelesai: this.formatTime(item.jamSelesai),
            }));
            this.totalItems = response.totalElements;
        } else {
            this.allLapangan = [];
            this.totalItems = 0;
            console.error('Invalid data format received:', response);
        }
    },
    error: (error) => {
        console.error('Failed to load lapangan:', error);
    }
    });
  }

  onPageChanged(event: any) {
    const newPage = event?.page != null ? event.page + 1 : 1;
    this.loadAllLapangan({ page: newPage - 1, size: this.itemsPerPage });
  }
  
  
  showCreateModal() {
    this.dataLapangan = {idLapangan: 0, namaLapangan: '', jamMulai: [], jamSelesai: []}; // Reset the form
    this.displayCreateModal = true;
  }

  createLapangan() {
    this.lapanganService.createLapangan(this.dataLapangan).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Lapangan berhasil dibuat!', 'success');
        console.log('Lapangan created successfully', response);
        this.displayCreateModal = false;
        this.loadAllLapangan();  // Reload the list to show the new lapangan
      },
      error: (error) => {
        Swal.fire('Error', 'Gagal membuat lapangan!', 'error');
        this.displayCreateModal = false;
      }
    });
  }

  onEdit(idLapangan: number): void {
    if (this.allLapangan) {
        const foundLapangan = this.allLapangan.find(lapangan => lapangan.idLapangan === idLapangan);
        if (foundLapangan) {
            this.dataLapangan = foundLapangan;
            this.displayEditModal = true;
        } else {
            console.error('Lapangan dengan ID yang diberikan tidak ditemukan.');
        }
    } else {
        console.error('Data lapangan tidak tersedia.');
    }
  }

  saveEdit(): void {
    if (this.dataLapangan.idLapangan !== undefined) {
      
      this.lapanganService.editLapangan(this.dataLapangan.idLapangan, this.dataLapangan).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Lapangan berhasil diubah!', 'success');
          this.displayEditModal = false;
          this.loadAllLapangan({ page: this.currentPage - 1, size: this.itemsPerPage });
        },
        error: (error) => {
          Swal.fire('Error', 'Gagal mengedit lapangan!', 'error');
          this.displayEditModal = false;
        }
      });
    } else {
      Swal.fire('Error', 'Data lapangan tidak lengkap atau ID tidak tersedia!', 'error');
      this.displayEditModal = false;
    }
  }  

  confirmDelete(idLapangan: number): void {
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
            this.deleteLapangan(idLapangan);
        }
    });
  }

  deleteLapangan(idLapangan: number): void {
    this.lapanganService.deleteLapangan(idLapangan).subscribe({
        next: (response) => {
            Swal.fire(
                'Deleted!',
                'Data telah terhapus.',
                'success'
            );
            this.loadAllLapangan();
        },
        error: (error) => {
            Swal.fire('Error', 'Failed to delete lapangan: ' + error.message, 'error');
        }
    });
  }

  onSearchInput() {
    this.currentPage = 1;
    this.loadAllLapangan();
  }
}
