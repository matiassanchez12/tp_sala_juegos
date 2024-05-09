import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe',
  standalone: true,
})
export class timePipe implements PipeTransform {
  transform(timestamp: any) {
    const date = timestamp.toDate();
    const value = this.formatDate(date, 'yyyy/MM/dd HH:mm:ss');

    let ahora = Date.now();
    let antes = Date.parse(value);
    let milisegundo = ahora - antes;
    let segundos: any = Math.floor(milisegundo / 1000);
    let minutos: any = 0;
    let horas = 0;
    let dias = Math.floor(horas / 24);
    let mensaje = 'hace: ';
    if (segundos > 60) {
      minutos = Math.floor(segundos / 60);
      segundos = segundos % minutos;

      if (minutos > 60) {
        horas = Math.floor(minutos / 60);
        minutos = minutos % horas;
      }

      if (horas > 24) {
        dias = Math.floor(horas / 24);
        horas = horas % dias;
      }

      if (dias != 0) {
        const plural = dias > 1 ? 's' : '';
        mensaje = mensaje + dias + ' día' + plural;
      } else {
        mensaje = 'Hoy ' + mensaje;

        if(horas > 0){
            mensaje = mensaje + horas + ' hrs';
        } else {
            mensaje = mensaje + minutos + ' min';
        }
      }
    } else {
      mensaje = 'Recien ';
    }
    return mensaje;
  }

  private formatDate(date: Date, format: string): string {
    const formattedDate: string = format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('dd', date.getDate().toString().padStart(2, '0'))
      .replace('HH', date.getHours().toString().padStart(2, '0'))
      .replace('mm', date.getMinutes().toString().padStart(2, '0'))
      .replace('ss', date.getSeconds().toString().padStart(2, '0'));

    return formattedDate;
  }
}
