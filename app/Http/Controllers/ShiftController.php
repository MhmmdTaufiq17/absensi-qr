<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Shifts/Index', [
            'shifts' => Shift::orderBy('check_in_start')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:100',
            'check_in_start'  => 'required',
            'check_in_end'    => 'required',
            'check_out_start' => 'required',
            'check_out_end'   => 'required',
        ]);

        Shift::create($request->all());

        return back()->with('success', 'Shift berhasil ditambahkan.');
    }

    public function update(Request $request, Shift $shift)
    {
        $request->validate([
            'name'            => 'required|string|max:100',
            'check_in_start'  => 'required',
            'check_in_end'    => 'required',
            'check_out_start' => 'required',
            'check_out_end'   => 'required',
        ]);

        $shift->update($request->all());

        return back()->with('success', 'Shift berhasil diperbarui.');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();
        return back()->with('success', 'Shift berhasil dihapus.');
    }

    public function toggleActive(Shift $shift)
    {
        // Deactivate all, then toggle this one
        Shift::query()->update(['is_active' => false]);
        if (!$shift->is_active) {
            $shift->update(['is_active' => true]);
        }
        return back()->with('success', 'Status shift diperbarui.');
    }
}
