import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class ConsultaService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: { data: string; paciente_id: string; profissional_id: string; observacoes?: string }) {
    const [paciente, profissional] = await this.prisma.$transaction([
      this.prisma.paciente.findUnique({ where: { id: dto.paciente_id }, select: { id: true } }),
      this.prisma.profissional.findUnique({ where: { id: dto.profissional_id }, select: { id: true, status: true } }),
    ]);

    if (!paciente) throw new NotFoundException('Paciente não encontrado.');
    if (!profissional) throw new NotFoundException('Profissional não encontrado.');
    if (profissional.status !== 'ativo') throw new BadRequestException('Profissional inativo.');

    return this.prisma.consulta.create({
      data: {
        data: new Date(dto.data),
        paciente_id: dto.paciente_id,
        profissional_id: dto.profissional_id,
        observacoes: dto.observacoes,
      },
    });
  }

  async buscar(id: string) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
      include: {
        paciente: { include: { usuario: { select: { nome: true, email: true } } } },
        profissional: { include: { usuario: { select: { nome: true, email: true } } } },
      },
    });
    if (!consulta) throw new NotFoundException('Consulta não encontrada.');
    return consulta;
  }

  async listarPorPaciente(paciente_id: string, page = 1, take = 10) {
    const skip = (page - 1) * take;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.consulta.findMany({ where: { paciente_id }, orderBy: { data: 'desc' }, skip, take }),
      this.prisma.consulta.count({ where: { paciente_id } }),
    ]);
    return { items, meta: { page, take, total } };
  }
}
