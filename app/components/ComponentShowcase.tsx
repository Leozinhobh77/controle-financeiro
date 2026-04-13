'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './ui';

/**
 * ComponentShowcase
 * Demonstra todos os componentes UI customizados com dark mode
 * Útil para validar que design system está funcionando
 */
export function ComponentShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('buttons');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
          Component Showcase
        </h1>
        <p className="text-text-secondary">
          Validação de design system com dark mode + amber accent
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Todos os estilos de botão disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default (Amber)</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Components</CardTitle>
              <CardDescription>Campos de texto e seleção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Text Input
                </label>
                <Input
                  type="text"
                  placeholder="Digite algo..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary">
                  Select Dropdown
                </label>
                <Select className="mt-2">
                  <option>Opção 1</option>
                  <option>Opção 2</option>
                  <option>Opção 3</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Example</CardTitle>
              <CardDescription>
                Cards são o componente base para layouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Este é o conteúdo do card. Pode incluir qualquer tipo de elemento.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent border-2">
            <CardHeader>
              <CardTitle>Featured Card</CardTitle>
              <CardDescription>Card com borda amber (destaque)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Borda customizada para destacar cards importantes
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Status e tags com cores customizadas</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default (Amber)</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">✅ Success</Badge>
              <Badge variant="warning">⚠️ Warning</Badge>
              <Badge variant="destructive">❌ Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Dialog Demo</CardTitle>
          <CardDescription>Modais funcionando com escape key</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setDialogOpen(true)}>
            Abrir Dialog
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              Este é um dialog de exemplo. Pressione ESC para fechar.
            </DialogDescription>
          </DialogHeader>
          <p className="text-text-secondary">
            O conteúdo do dialog vai aqui.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
