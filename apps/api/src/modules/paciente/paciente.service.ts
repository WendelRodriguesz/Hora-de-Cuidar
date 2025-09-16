import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: { usuario_id: string; prontuario?: string }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: dto.usuario_id },
      select: { id: true, cargo: true, deleted_at: true },
    });
    if (!usuario || usuario.deleted_at) throw new NotFoundException('Usuário não encontrado.');
    if (usuario.cargo !== 'PACIENTE') throw new BadRequestException('Usuário não possui cargo PACIENTE.');

    const existente = await this.prisma.paciente.findUnique({ where: { usuario_id: dto.usuario_id } });
    if (existente) throw new BadRequestException('Paciente já cadastrado para este usuário.');

    return this.prisma.paciente.create({ data: { usuario_id: dto.usuario_id, prontuario: dto.prontuario } });
  }

  async buscar(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
    if (!paciente) throw new NotFoundException('Paciente não encontrado.');
    return paciente;
  }

  async atualizar(id: string, dto: { prontuario?: string }) {
    await this.ensureExists(id);
    return this.prisma.paciente.update({ where: { id }, data: { prontuario: dto.prontuario } });
  }

  async listar(pag = 1, take = 10) {
    const skip = (pag - 1) * take;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.paciente.findMany({
        skip, take, orderBy: { id: 'desc' },
        include: { usuario: { select: { id: true, nome: true, email: true } } },
      }),
      this.prisma.paciente.count(),
    ]);
    return { items, meta: { page: pag, take, total } };
  }

  private async ensureExists(id: string) {
    const p = await this.prisma.paciente.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Paciente não encontrado.');
  }
}
