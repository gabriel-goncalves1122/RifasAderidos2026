import { Box, Card, CardContent, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { surfaces } from "@/shared/tokens/surfaces";

interface SkeletonSecretariaListProps {
  isMobile: boolean;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={160} />
        </Stack>
      </TableCell>
      <TableCell><Skeleton variant="text" width={200} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={100} height={24} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={120} height={24} /></TableCell>
      <TableCell align="center"><Skeleton variant="rounded" width={100} height={24} /></TableCell>
    </TableRow>
  );
}

function SkeletonCard() {
  return (
    <Card variant="outlined" sx={surfaces.card}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rounded" width="100%" height={80} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function SkeletonSecretariaList({ isMobile }: SkeletonSecretariaListProps) {
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </Stack>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={surfaces.tableHead}>
          <TableRow>
            {["Usuário", "E-mail Autorizado", "Modalidade", "Titularidade", "Status"].map((h) => (
              <TableCell key={h}><strong>{h}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
